// За основу взят https://github.com/frux/express-csp-header

import crypto from 'crypto';
import { type CSPHeaderParams, getCSP, nonce } from 'csp-header';
import type { Request, RequestHandler, Response } from 'express';
import * as psl from 'psl';

import { NONCE, TLD } from '../config/constants';

export * from '../config/constants';

type ReportUriFunction = (req: Request, res: Response) => string;

export type ParseOptions = {
  customTlds?: string[] | RegExp;
};

export type ExpressCSPParams = {
  domainOptions?: ParseOptions;
  reportOnly?: boolean;
  reportUri?: string | ReportUriFunction;
} & Omit<CSPHeaderParams, 'reportUri'>;

const CSP_HEADER = 'Content-Security-Policy';
const CSP_REPORT_ONLY_HEADER = 'Content-Security-Policy-Report-Only';

function applyNonce(req: Request, cspString: string): string {
  if (cspString.includes(NONCE)) {
    //@ts-ignore
    req.nonce = crypto.randomBytes(16).toString('base64');
    //@ts-ignore

    return cspString.replace(new RegExp(NONCE, 'g'), nonce(req.nonce));
  }

  return cspString;
}

function parseDomain(hostname: string, domainOptions?: ParseOptions): string | null {
  const customTlds = domainOptions?.customTlds;
  if (customTlds instanceof RegExp) {
    const tld = hostname.match(customTlds);
    if (tld !== null) {
      return tld[0].replace(/^\.+/, '');
    }
  }

  if (Array.isArray(customTlds)) {
    for (const tld of customTlds) {
      if (hostname.endsWith(`.${tld}`)) {
        return tld;
      }
    }
  }

  const domain = psl.parse(hostname);

  if (domain.error) {
    return null;
  }

  return domain.tld;
}

function applyAutoTld(req: Request, cspString: string, domainOptions?: ParseOptions): string {
  if (cspString.includes(TLD)) {
    const tld = parseDomain(req.hostname, domainOptions);

    if (!tld) {
      return cspString;
    }

    return cspString.replace(new RegExp(TLD, 'g'), tld);
  }

  return cspString;
}

function getCspString(req: Request, res: Response, params: ExpressCSPParams): string {
  const { directives, presets, reportUri } = params;
  const cspHeaderParams: CSPHeaderParams = {
    directives,
    presets,
    reportUri: typeof reportUri === 'function' ? reportUri(req, res) : reportUri,
  };

  return getCSP(cspHeaderParams);
}

function setHeader(res: Response, cspString: string, params: ExpressCSPParams): void {
  const headerName = params.reportOnly ? CSP_REPORT_ONLY_HEADER : CSP_HEADER;
  res.set(headerName, cspString);
}

export function expressCspHeader(params?: ExpressCSPParams): RequestHandler {
  return function (req, res, next) {
    if (!params) {
      next();
      return;
    }

    const { domainOptions } = params;
    let cspString = getCspString(req, res, params);
    cspString = applyNonce(req, cspString);
    cspString = applyAutoTld(req, cspString, domainOptions);

    setHeader(res, cspString, params);

    next();
  };
}

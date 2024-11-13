import * as tar from 'tar';
import { createGunzip } from 'zlib';
import { EventEmitter } from 'events';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { BlockEntity } from 'src/app/entities/block.entity';

export interface PiletMetadataV0 {
  /**
   * The content of the pilet. If the content is not available
   * the link will be used (unless caching has been activated).
   */
  content?: string;
  /**
   * The link for retrieving the content of the pilet.
   */
  link?: string;
  /**
   * The computed hash value of the pilet's content. Should be
   * accurate to allow caching.
   */
  hash: string;
  /**
   * If available indicates that the pilet should not be cached.
   * In case of a string this is interpreted as the expiration time
   * of the cache. In case of an accurate hash this should not be
   * required or set.
   */
  noCache?: boolean | string;
  /**
   * The schema type of the pilet.
   */
  type: 'v0';
}

export interface PiletMetadataV1 {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * The schema type of the pilet.
   */
  type: 'v1';
}

export interface PiletMetadataV2 {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * The schema type of the pilet.
   */
  type: 'v2';
  /**
   * The dependencies that should be loaded for this pilet.
   */
  dependencies?: Record<string, string>;
}

export interface PiletMetadataVx {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the used spec, if any.
   */
  spec?: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * The schema type of the pilet.
   */
  type: 'vx';
}

export interface PiletMetadataBase {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * The description of the pilet.
   */
  description: string;
  /**
   * The author of the pilet.
   */
  author?: {
    name: string;
    email: string;
  };
  /**
   * The license of the pilet.
   */
  license: {
    type: string;
    text: string;
  };
}

const TarParser = tar.Parser as any;

interface ReadEntry extends EventEmitter {
  path: string;
  mode: number;
  ignore: boolean;
}

/**
 * Describes the metadata transported by a pilet.
 */
export type PiletMetadata = (PiletMetadataV0 | PiletMetadataV1 | PiletMetadataV2 | PiletMetadataVx) & PiletMetadataBase;

export interface Pilet {
  meta: PiletMetadata;
  files: PackageFiles;
}

export interface PackageFiles {
  [file: string]: Buffer;
}

export interface PackageData {
  name: string;
  description: string;
  version: string;
  preview?: boolean;
  custom?: any;
  author?:
    | string
    | {
        name?: string;
        url?: string;
        email?: string;
      };
  main?: string;
  license?: string;
  dependencies?: {
    [name: string]: string;
  };
  devDependencies?: {
    [name: string]: string;
  };
  peerDependencies?: {
    [name: string]: string;
  };
}

export interface ActiveAuthRequest {
  id: string;
  clientId: string;
  clientName: string;
  description: string;
  notifiers: Array<(success: boolean) => void>;
  status: string;
}

export interface PiletVersions {
  current: string;
  versions: Record<string, Pilet>;
}

export function untar(stream: NodeJS.ReadableStream): Promise<PackageFiles> {
  return new Promise((resolve, reject) => {
    const files: PackageFiles = {};
    stream
      .on('error', reject)
      .pipe(createGunzip())
      .on('error', reject)
      .pipe(new TarParser())
      .on('error', reject)
      .on('entry', (e: ReadEntry) => {
        const content: Array<Buffer> = [];
        const p = e.path;

        e.on('error', reject);
        e.on('data', (c: Buffer) => content.push(c));
        e.on('end', () => (files[p] = Buffer.concat(content)));
      })
      .on('end', () => resolve(files));
  });
}

export type PiletDb = Record<string, PiletVersions>;

const packageRoot = 'package/';
const distRoot = 'dist';
const libRoot = 'lib';
const checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
const checkV2 = /^\/\/\s*@pilet\s+v:2\s*\(([A-Za-z0-9\_\:\-]+)\s*,\s*(.*)\)/;
const checkVx = /^\/\/\s*@pilet\s+v:x\s*(?:\((.*)\))?/;

export function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  const content = fileContent.toString('utf8');
  return JSON.parse(content);
}

export function getPilet(pilet: PiletMetadata) {
  switch (pilet.type) {
    case 'v0':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        content: pilet.content,
        hash: pilet.hash,
        noCache: pilet.noCache,
        custom: pilet.custom,
        spec: 'v0',
      };
    case 'v1':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        requireRef: pilet.requireRef,
        integrity: pilet.integrity,
        custom: pilet.custom,
        spec: 'v1',
      };
    case 'v2':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        requireRef: pilet.requireRef,
        integrity: pilet.integrity,
        custom: pilet.custom,
        dependencies: pilet.dependencies,
        spec: 'v2',
      };
    case 'vx':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        integrity: pilet.integrity,
        custom: pilet.custom,
        spec: pilet.spec || 'vx',
      };
    default:
      return pilet;
  }
}

export const getPkgDomain = (pkg: PackageData) => {
  const { name = '' } = pkg;
  return name.split('/');
};

const getPkgVersion = (pkg: PackageData) => {
  const { version } = pkg;
  return version;
};

const queryFilename = (unzipFilename: string) => {
  return unzipFilename.replace(packageRoot, '');
};

const saveAsFile = async (dir: string, filename: string, buf: Buffer) => {
  if (filename.includes(distRoot) || filename.includes(libRoot)) {
    const [subdir, expected] = filename.split('/');
    dir = `${dir}/${subdir}`;
    filename = expected;
  }
  const hasExist = existsSync(dir);
  if (!hasExist) {
    await mkdir(dir, { recursive: true });
  }
  await writeFile(`${dir}/${filename}`, buf);
};

const extractMain = (mainContent: string) => {
  if (checkV1.test(mainContent)) {
    const [, requireRef] = checkV1.exec(mainContent);
    return { spec: 'v1', requireRef };
  } else if (checkV2.test(mainContent)) {
    const [, requireRef] = checkV2.exec(mainContent);
    return { spec: 'v2', requireRef };
  } else if (checkVx.test(mainContent)) {
    return { spec: 'vx', requireRef: '' };
  }
  return { spec: 'v0', requireRef: '' };
};

export const saveAsBlock = async (unzipFiles: PackageFiles): Promise<BlockEntity | null> => {
  const pkg = getPackageJson(unzipFiles);
  const [org, name] = getPkgDomain(pkg);
  const version = getPkgVersion(pkg);
  const savedPaths = ['static', 'blocks', org, name, version].filter((v) => Boolean(v));
  const saveDir = savedPaths.join('/');
  let mainFileKey = '';
  let mainFile = '';
  for (const key in unzipFiles) {
    const filename = queryFilename(key);
    const buf = unzipFiles[key];
    await saveAsFile(saveDir, filename, buf);
    if (filename === pkg.main || /^index\..+(\.js)$/.test(filename)) {
      mainFileKey = filename;
      mainFile = buf.toString();
    }
  }
  const { spec, requireRef } = extractMain(mainFile.toString());
  return {
    org,
    name: name ? `${org}/${name}` : name,
    version,
    spec,
    link: `http://localhost:3000/${savedPaths.slice(1).join('/')}/${mainFileKey}`,
    requireRef,
    dependencies: '{}',
  };
};

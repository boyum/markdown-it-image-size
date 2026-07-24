import { dirname } from "node:path";

type VitePressEnv = {
  path?: string;
};

type EleventyEnv = {
  page?: {
    inputPath?: string;
  };
};

export type GeneratorEnv = VitePressEnv | EleventyEnv;

const isEleventyEnv = (env: GeneratorEnv | undefined): env is EleventyEnv =>
  (env as EleventyEnv)?.page?.inputPath !== undefined;

const getEleventyPath = (env: EleventyEnv | undefined) => env?.page?.inputPath;

const isVitePressEnv = (env: GeneratorEnv | undefined): env is VitePressEnv =>
  (env as VitePressEnv)?.path !== undefined;

const getVitePressPath = (env: VitePressEnv | undefined) => env?.path;

export const getAbsPathFromGeneratorEnv = (
  env: GeneratorEnv | undefined,
): string | undefined => {
  let markdownPath: string | undefined;

  switch (true) {
    case isEleventyEnv(env):
      markdownPath = getEleventyPath(env);
      break;

    case isVitePressEnv(env):
      markdownPath = getVitePressPath(env);
      break;
  }

  if (markdownPath === undefined) {
    return undefined;
  }

  return dirname(markdownPath.replace(/\\/g, "/")).replace(/\/\.\//g, "/");
};

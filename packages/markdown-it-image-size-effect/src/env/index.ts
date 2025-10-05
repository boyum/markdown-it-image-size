import { Effect } from 'effect';

export type VitePressEnv = {
  path?: string;
};

export type EleventyEnv = {
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
): Effect<string | undefined> => {
  return Effect.try(() => {
    let markdownPath: string | undefined = undefined;

    switch (true) {
      case isEleventyEnv(env):
        markdownPath = getEleventyPath(env);
        break;

      case isVitePressEnv(env):
        markdownPath = getVitePressPath(env);
        break;
    }

    return markdownPath
      ?.substring(0, markdownPath.lastIndexOf("/"))
      .replace(/\/\.\//g, "/");
  });
};
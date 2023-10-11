import { GitLFSCheckModule, IGitLFSCheckModuleContext } from './modules';

import { IRushGitLFSPluginOption, loadPluginOptions } from '../options';

import { getFilePathsFromChangedFiles, validateFilePaths } from '../helpers/file-path-analyser';
import { terminal, withPrefix } from '../helpers/terminal';

import type { NestedRequired } from '../helpers/type';
import type { ICommandLineOptions } from '../check';
import ora from 'ora';

const normalizeCheckContext = (commandLineOption: ICommandLineOptions): IGitLFSCheckModuleContext => {
  // eslint-disable-next-line prefer-const
  let { file: files, fix } = commandLineOption;
  if (typeof files === 'undefined') {
    files = getFilePathsFromChangedFiles();
  } else {
    try {
      validateFilePaths(files);
    } catch (e: any) {
      if (e.message) {
        terminal.writeErrorLine(withPrefix(e.message));
      } else {
        throw e;
      }
      process.exit(1);
    }
  }

  const option: NestedRequired<IRushGitLFSPluginOption> = loadPluginOptions();
  const spinner: ora.Ora = ora();
  return {
    result: [],
    fix,
    files,
    option,
    spinner
  };
};

export const runCheck = async (commandLineOption: ICommandLineOptions): Promise<void> => {
  const checker: GitLFSCheckModule = new GitLFSCheckModule();
  const ctx: IGitLFSCheckModuleContext = normalizeCheckContext(commandLineOption);
  await checker.run(ctx);
  if (ctx.result.filter((e) => typeof e.errorType !== 'undefined' && !e.fixed).length > 0) {
    if (ctx.option.errorTips) {
      terminal.writeLine(ctx.option.errorTips);
    }
    process.exit(1);
  }
};

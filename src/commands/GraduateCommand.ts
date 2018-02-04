import * as _ from 'underscore';
import * as inquirer from 'inquirer';
import { Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';
import { InteractiveMode } from '../console/InteractiveMode';
import { Logger } from '../commons/logger';
import { StaticErrorMessage } from '../commons/errors';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { Field } from '../coveoObjects/Field';
import { IDiffOptions, DiffCommand } from './DiffCommand';

export interface IHTTPGraduateOptions {
  POST: boolean;
  PUT: boolean;
  DELETE: boolean;
}

export interface IGraduateOptions extends IHTTPGraduateOptions {
  force: boolean;
  diffOptions: IDiffOptions;
}

export class GraduateCommand {
  private organization1: Organization;
  private organization2: Organization;
  private interactiveMode: InteractiveMode;
  private options: IGraduateOptions;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
    options?: IGraduateOptions
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
    this.interactiveMode = new InteractiveMode();
    this.options = _.extend(GraduateCommand.DEFAULT_OPTIONS, options) as IGraduateOptions;
  }

  static DEFAULT_OPTIONS: IGraduateOptions = {
    diffOptions: DiffCommand.DEFAULT_OPTIONS,
    force: false,
    POST: true,
    PUT: true,
    DELETE: true
  };

  static COMMAND_NAME: string = 'graduate';

  public graduateFields() {
    const fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    const questions: inquirer.Questions = [];
    const allowedMethods: string[] = _.compact([
      this.options.POST ? 'POST' : '',
      this.options.PUT ? 'PUT' : '',
      this.options.DELETE ? 'DELETE' : ''
    ]);

    if (!this.options.force) {
      questions.push(
        this.interactiveMode.confirmGraduationAction(`Are you sure want to perform a field graduation (${allowedMethods})?`, 'confirm')
      );
    }
    // Make sure the user selects at least one HTTP method
    inquirer.prompt(questions).then((res: inquirer.Answers) => {
      if (res.confirm || this.options.force) {
        // TODO: Ask the user if he wants to perform the graduation manually HERE!!!

        Logger.startSpinner('Performing Field Graduation');
        fieldController
          .diff(this.options.diffOptions)
          .then((diffResultArray: DiffResultArray<Field>) => {
            fieldController
              .graduate(diffResultArray, this.options)
              .then(() => {
                Logger.info('Graduation operation completed');
                Logger.stopSpinner();
              })
              .catch((err: any) => {
                Logger.error(StaticErrorMessage.UNABLE_TO_GRADUATE, err);
                Logger.stopSpinner();
              });
          })
          .catch((err: any) => {
            Logger.error('Error in graduation operation', err);
            Logger.stopSpinner();
          });
      } else {
        Logger.info('No fields were graduated');
        Logger.stopSpinner();
      }
    });
  }

  public graduateSources() {}

  public graduateExtensions() {}
}

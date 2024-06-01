import {
  NotionDate,
  NotionFile,
  NotionRichText,
  NotionVerificationStatus,
} from './notionHelperTypes';

export enum NotionPropertyType {
  Number = 'number',
  Url = 'url',
  Select = 'select',
  MultiSelect = 'multiSelect',
  Status = 'status',
  Date = 'date',
  Email = 'email',
  PhoneNumber = 'phoneNumber',
  Checkbox = 'checkbox',
  Files = 'files',
  CreatedBy = 'createdBy',
  CreatedTime = 'createdTime',
  LastEditedBy = 'lastEditedBy',
  LastEditedTime = 'lastEditedTime',
  StringFormula = 'stringFormula',
  DateFormula = 'dateFormula',
  NumberFormula = 'numberFormula',
  BooleanFormula = 'booleanFormula',
  Button = 'button',
  UniqueId = 'uniqueId',
  Verification = 'verification',
  Title = 'title',
  RichText = 'richText',
  People = 'people',
  Relation = 'relation',
  Rollup = 'rollup',
}

export interface NotionPropertyBase {
  type: NotionPropertyType;
  notionId: string;
  name: string;
}

export type NotionDocumentProperty =
  | NotionNumberProperty
  | NotionUrlProperty
  | NotionSelectProperty
  | NotionMultiSelectProperty
  | NotionStatusProperty
  | NotionDateProperty
  | NotionEmailProperty
  | NotionPhoneNumberProperty
  | NotionCheckboxProperty
  | NotionFilesProperty
  | NotionCreatedByProperty
  | NotionCreatedTimeProperty
  | NotionLastEditedByProperty
  | NotionLastEditedTimeProperty
  | NotionStringFormulaProperty
  | NotionDateFormulaProperty
  | NotionNumberFormulaProperty
  | NotionBooleanFormulaProperty
  | NotionButtonProperty
  | NotionUniqueIdProperty
  | NotionVerificationProperty
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionPeopleProperty
  | NotionRelationProperty
  | NotionRollupProperty;

export interface NotionNumberProperty extends NotionPropertyBase {
  type: NotionPropertyType.Number;
  value: number | null;
}

export interface NotionUrlProperty extends NotionPropertyBase {
  type: NotionPropertyType.Url;
  value: string | null;
}

export interface NotionSelectProperty extends NotionPropertyBase {
  type: NotionPropertyType.Select;
  value: string | null;
}

export interface NotionMultiSelectProperty extends NotionPropertyBase {
  type: NotionPropertyType.MultiSelect;
  value: Array<string>;
}

export interface NotionStatusProperty extends NotionPropertyBase {
  type: NotionPropertyType.Status;
  value: string | null;
}

export interface NotionDateProperty extends NotionPropertyBase {
  type: NotionPropertyType.Status;
  value: NotionDate | null;
}

export interface NotionEmailProperty extends NotionPropertyBase {
  type: NotionPropertyType.Email;
  value: string | null;
}

export interface NotionPhoneNumberProperty extends NotionPropertyBase {
  type: NotionPropertyType.PhoneNumber;
  value: string | null;
}

export interface NotionCheckboxProperty extends NotionPropertyBase {
  type: NotionPropertyType.Checkbox;
  value: boolean;
}

export interface NotionFilesProperty extends NotionPropertyBase {
  type: NotionPropertyType.Files;
  value: Array<NotionFile>;
}

export interface NotionCreatedByProperty extends NotionPropertyBase {
  type: NotionPropertyType.CreatedBy;
  value: string;
}

export interface NotionCreatedTimeProperty extends NotionPropertyBase {
  type: NotionPropertyType.CreatedTime;
  value: string;
}

export interface NotionLastEditedByProperty extends NotionPropertyBase {
  type: NotionPropertyType.LastEditedBy;
  value: string;
}

export interface NotionLastEditedTimeProperty extends NotionPropertyBase {
  type: NotionPropertyType.LastEditedTime;
  value: string;
}

export interface NotionStringFormulaProperty extends NotionPropertyBase {
  type: NotionPropertyType.StringFormula;
  value: string | null;
}

export interface NotionDateFormulaProperty extends NotionPropertyBase {
  type: NotionPropertyType.DateFormula;
  value: NotionDate | null;
}

export interface NotionNumberFormulaProperty extends NotionPropertyBase {
  type: NotionPropertyType.NumberFormula;
  value: number | null;
}

export interface NotionBooleanFormulaProperty extends NotionPropertyBase {
  type: NotionPropertyType.BooleanFormula;
  value: boolean | null;
}

export interface NotionButtonProperty extends NotionPropertyBase {
  type: NotionPropertyType.Button;
  value: undefined;
}

export interface NotionUniqueIdProperty extends NotionPropertyBase {
  type: NotionPropertyType.UniqueId;
  value: {
    prefix: string | null;
    number: number | null;
  };
}

export interface NotionVerificationProperty extends NotionPropertyBase {
  type: NotionPropertyType.Verification;
  value: {
    status: NotionVerificationStatus;
  };
}

export interface NotionTitleProperty extends NotionPropertyBase {
  type: NotionPropertyType.Title;
  value: NotionRichText;
}

export interface NotionRichTextProperty extends NotionPropertyBase {
  type: NotionPropertyType.RichText;
  value: NotionRichText;
}

export interface NotionPeopleProperty extends NotionPropertyBase {
  type: NotionPropertyType.People;
  value: Array<string>;
}

export interface NotionRelationProperty extends NotionPropertyBase {
  type: NotionPropertyType.Relation;
  value: Array<string>;
}

export interface NotionRollupProperty extends NotionPropertyBase {
  type: NotionPropertyType.Rollup;
  value: undefined;
}

export type NotionPropertySchemaDefinition = {
  notionId: string;
  displayName: string;
  // camelcase representation of the displayName, along with any special characters removed
  generatedName: string;
  type: NotionPropertyType;
  // This is used for client generation - to generate enums for specific types
  allowedValues?: Array<string>;
};

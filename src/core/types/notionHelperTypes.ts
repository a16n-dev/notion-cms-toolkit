export type NotionBaseColor =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

export type NotionColor = NotionBaseColor | `${NotionBaseColor}_background`;

export type NotionCodeLanguage =
  | 'abap'
  | 'agda'
  | 'arduino'
  | 'assembly'
  | 'bash'
  | 'basic'
  | 'bnf'
  | 'c'
  | 'c#'
  | 'c++'
  | 'clojure'
  | 'coffeescript'
  | 'coq'
  | 'css'
  | 'dart'
  | 'dhall'
  | 'diff'
  | 'docker'
  | 'ebnf'
  | 'elixir'
  | 'elm'
  | 'erlang'
  | 'f#'
  | 'flow'
  | 'fortran'
  | 'gherkin'
  | 'glsl'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'haskell'
  | 'html'
  | 'idris'
  | 'java'
  | 'javascript'
  | 'json'
  | 'julia'
  | 'kotlin'
  | 'latex'
  | 'less'
  | 'lisp'
  | 'livescript'
  | 'llvm ir'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'markup'
  | 'matlab'
  | 'mathematica'
  | 'mermaid'
  | 'nix'
  | 'notion formula'
  | 'objective-c'
  | 'ocaml'
  | 'pascal'
  | 'perl'
  | 'php'
  | 'plain text'
  | 'powershell'
  | 'prolog'
  | 'protobuf'
  | 'purescript'
  | 'python'
  | 'r'
  | 'racket'
  | 'reason'
  | 'ruby'
  | 'rust'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shell'
  | 'solidity'
  | 'sql'
  | 'swift'
  | 'toml'
  | 'typescript'
  | 'vb.net'
  | 'verilog'
  | 'vhdl'
  | 'visual basic'
  | 'webassembly'
  | 'xml'
  | 'yaml'
  | 'java/c/c++/c#';

export enum NotionIconType {
  Emoji = 'emoji',
  Image = 'image',
}

export type NotionIcon =
  | {
      type: NotionIconType.Emoji;
      emoji: string;
    }
  | {
      type: NotionIconType.Image;
      file: NotionFile;
    }
  | null;

export type NotionFile = {
  url: string;
  name?: string;
};

export enum NotionObjectType {
  Block = 'block',
  Page = 'page',
  Database = 'database',
  Workspace = 'workspace',
  Comment = 'comment',
}

export enum NotionRichTextItemType {
  Text = 'text',
  Mention = 'mention',
  Equation = 'equation',
}

export type NotionRichTextAnnotation = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color?: NotionColor;
};

export type NotionRichText = Array<NotionRichTextItem>;

export interface NotionRichTextItem {
  type: NotionRichTextItemType;
  annotations: NotionRichTextAnnotation;
  text: string;
  href?: string;
}

export type NotionDate = {
  start: string;
  end?: string;
  timeZone?: string;
};

export enum NotionVerificationStatus {
  Unverified = 'unverified',
  Verified = 'verified',
  Expired = 'expired',
}

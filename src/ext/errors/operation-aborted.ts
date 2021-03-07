export class OperationAborted extends Error {
  public constructor(message?: string) {
    super(message);
  }

  public toString(): string {
    return 'OperationAborted';
  }
}
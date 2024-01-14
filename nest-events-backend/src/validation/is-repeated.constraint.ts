import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsRepeated(
  property: string, // the custom attribute of a decorator
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRepeated',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, { object }: ValidationArguments) {
          if (!object.hasOwnProperty(property)) return false;
          return value === object[property];
        },
        defaultMessage(): string {
          return `${propertyName} needs to be equal to ${property}`;
        },
      },
    });
  };
}

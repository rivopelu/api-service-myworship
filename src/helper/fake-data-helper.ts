import { faker } from '@faker-js/faker';

export const fakeImage = (width = 1920, height = 1080): string => {
  return faker.image.abstract(width, height);
};
export const fakeFirstName = () => faker.name.firstName();
export const fakeLastName = () => faker.name.firstName();
export const fakeNumber = (min?: number, max?: number): number => {
  return faker.datatype.number({ min: min ?? 10, max: max ?? 1000 });
};
export const fakeName = (): string => {
  return faker.name.fullName();
};
export const fakeCity = (): string => {
  return faker.address.city().toString();
};
export const fakeFloat = () => {
  return faker.datatype.float({ min: 1.1, max: 99.0 });
};

export const fakeListFormat = (list: string[]): string => {
  return faker.helpers.arrayElement(list);
};

export const fakeId = () => {
  return faker.datatype.uuid();
};

export const fakeString = (lines?: number) => {
  return faker.lorem.lines(lines ?? 1);
};

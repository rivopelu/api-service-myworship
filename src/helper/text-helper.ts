export class TextHelper {
  public toSlug(data: string) {
    return data.split(' ').join('-').toLowerCase();
  }

  public toLowercaseEnum(data: string) {
    return data.split('_').join('-').toLowerCase();
  }
}

export class Helpers {
  static firstLetterUpperCase(str: string): string {
    const value = str.toLowerCase();
    /**
     * @todo
     * 1. Return the first letter of the string in uppercase
     * 2. Return the rest of the string
     * 3. Concatenate the first letter and the rest of the string
     * 4. Return the result
     * @result
     * 1. 'hello world Machine are My world' => 'Hello World Machine Are My World'
     */
    return value
      .split(' ')
      .map((word: string) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
      .join(' ');
  }

  static lowerCase(str: string): string {
    return str.toLowerCase();
  }

  /**
   * @description - It returns a random number based on the length provided
   * @param {number} integerLength
   * @returns {number}
   */
  static generateRandomInteger(integerLength: number): number {
    const characters = '0123456789';
    let result = '';
    const charactersLength: number = characters.length;
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return Number(result);
  }
}

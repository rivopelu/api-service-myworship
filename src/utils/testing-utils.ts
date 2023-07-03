import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import ILoginDto from '../dto/request/auth-request/ILoginDto';

export async function loginCmsTest(app: INestApplication): Promise<string> {
  const data: ILoginDto = {
    email: 'super_admin@gmail.com',
    password: 'super_admin',
  };
  const loginUrl = '/cms/auth/v1/login';
  const response = await request(app.getHttpServer()).post(loginUrl).send(data);
  return response.body.response_data.access_token;
}

export function setTokenTest(token: string): ISetToken {
  return {
    auth: 'Authorization',
    token: `Bearer ${token}`,
  };
}

export function getRandomCategoriesTesting(): number[] {
  function getRandomLength(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArray<T>(array: T[], length: number): T[] {
    const randomArray: T[] = [];

    if (length > array.length) {
      throw new Error(
        'Requested length is greater than the number of available elements',
      );
    }

    const shuffledArray = array.slice(); // Create a copy of the array

    while (randomArray.length < length) {
      const randomIndex = Math.floor(Math.random() * shuffledArray.length);
      const randomValue = shuffledArray.splice(randomIndex, 1)[0];
      randomArray.push(randomValue);
    }

    return randomArray;
  }

  const dataArray = [16, 17, 18];
  const randomLength = getRandomLength(1, dataArray.length);
  return getRandomArray(dataArray, randomLength);
}

export function getRandomArtistTest() {
  function getRandomStringFromArray(array: string[]): string {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  const dataArray = ['unit-test', 'unit-test-2'];
  return getRandomStringFromArray(dataArray);
}

export function getRandomImageUrlTest() {
  function getRandomStringFromArray(array: string[]): string {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  const dataArray = [
    'https://sentrum-app.s3.ap-southeast-1.amazonaws.com/staging/d736f4bc-5746-42ec-9755-157c7cf03281Frame-30.png',
    'https://sentrum-app.s3.ap-southeast-1.amazonaws.com/staging/aa6624f4-4325-4deb-b3dd-8d647aacb156Rectangle-130.png',
    'https://sentrum-app.s3.ap-southeast-1.amazonaws.com/staging/fb125478-06e6-4498-94e3-7192aefde972Frame-23.png',
    'https://sentrum-app.s3.ap-southeast-1.amazonaws.com/staging/cf6eb258-5465-4ffb-b967-a3fe6bfb9b11Frame-33.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgcTqvVgNYbdKLGmVCEQg60gx01CiRabTRXvXYFOGqEQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCivPqUgkmBNSgylqOGxxpbevjhA1Hyu8LVQZmNvE4kQ&s',
    'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnJEFgF1hjiSZD9q5nuWNp-gep_njnZv2eeG7BNO6x-w&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7g62G22Wjgyz0BMTN6oOiq9vcgZzm9uyB6ama3lOhNw&s',
    'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_1280.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6qAP-zTwbaY4-AXPfLEGV0tN1XGTpSwrgBpPr9qLRtwAmma4DoSBJ2XuIajYbT0HfAP8&usqp=CAU',
    'https://www.pacegallery.com/media/images/heroimage.width-2000.webp',
    'https://lh3.googleusercontent.com/hwau7OVWx96XaME5KpRuJ0I_MscrerK6SbRH1UwYHYaxIDQQtn7RZK02LDSfBzCreidFgDsJeXyqDct6EZiH6vsV=w640-h400-e365-rj-sc0x00ffffff',
    'https://www.shutterstock.com/image-photo/random-act-kindness-260nw-731074915.jpg',
  ];
  return getRandomStringFromArray(dataArray);
}

export function getRandomYoutubeUrl() {
  function getRandomStringFromArray(array: string[]): string {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  const dataArray = [
    'https://www.youtube.com/watch?v=XU7nrf2HXjw&list=RDVQo4hyWfBQ4&index=16',
    'https://www.youtube.com/watch?v=Y0ORhLyJWuc&list=RDVQo4hyWfBQ4&index=17',
    'https://www.youtube.com/watch?v=3or3dp3qNQU&list=RDVQo4hyWfBQ4&index=18&pp=8AUB',
    'https://www.youtube.com/watch?v=e-ORhEE9VVg&list=RDVQo4hyWfBQ4&index=8',
    'https://www.youtube.com/watch?v=Z7yNvMzz2zg&list=RDVQo4hyWfBQ4&index=19',
  ];
  return getRandomStringFromArray(dataArray);
}

export function getRandomLyricsSlugTest() {
  function getRandomStringFromArray(array: string[]): string {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  const dataArray = [
    'be-with-you',
    'unit-test-lyrics',
    'test-unit',
    'layak-dipuji-disembah',
    'baru-lirik-rivo-admin',
  ];
  return getRandomStringFromArray(dataArray);
}

export interface ISetToken {
  auth: string;
  token: string;
}

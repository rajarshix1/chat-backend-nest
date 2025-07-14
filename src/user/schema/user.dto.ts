export class ReturnUserDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string | undefined
}

export class LoginUserDto {
  email: string | undefined;
  phoneNumber: string | undefined;
  password: string
}

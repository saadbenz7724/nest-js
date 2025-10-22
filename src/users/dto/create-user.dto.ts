import { IsString, IsEmail, IsInt, Min, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @MaxLength(50)
  role: string;
}

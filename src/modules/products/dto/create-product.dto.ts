import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name  is required' })
  @MaxLength(180, { message: 'Name must be at most 180 characters' })
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;
}

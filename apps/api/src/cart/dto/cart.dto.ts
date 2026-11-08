import { IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

export class SyncCartItemDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

export class SyncCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCartItemDto)
  items!: SyncCartItemDto[];
}

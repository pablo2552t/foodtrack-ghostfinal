import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    available?: boolean;
}

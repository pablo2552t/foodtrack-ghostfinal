import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CreateUserRole {
    ADMINISTRADOR = 'ADMINISTRADOR',
    COCINERO = 'COCINERO',
    CLIENTE = 'CLIENTE',
}

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ enum: CreateUserRole })
    @IsEnum(CreateUserRole)
    role: CreateUserRole;
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new CLIENT' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('create-user')
    @ApiOperation({ summary: 'Create user with role (Admin only)' })
    createUser(@Body() createUserDto: any) {
        return this.authService.createUser(createUserDto);
    }

    @Post('setup')
    @ApiOperation({ summary: 'Setup initial data (seed)' })
    setup() {
        return this.authService.setup();
    }
}

import { IsDefined, IsNotEmpty } from 'class-validator';

export class UserDto {
    @IsDefined()
    @IsNotEmpty()
    id: string;
}

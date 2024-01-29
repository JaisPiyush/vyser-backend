import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async login(uid: string) {
        const _user = await this.userRepository.findOne({ where: { id: uid } });
        if (_user) {
            return _user;
        }
        const user = new User();
        user.id = uid;
        return await this.userRepository.save(user);
    }
}

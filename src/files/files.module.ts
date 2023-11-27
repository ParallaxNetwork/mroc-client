import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FilesService } from '@/files/files.service';
import { FilesController } from '@/files/files.controller';
import { UsersService } from '@/users/users.service';

@Module({
  imports: [HttpModule],
  controllers: [FilesController],
  providers: [FilesService, UsersService],
})
export class FilesModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import uploadConfig from './config/upload.config';

@Module({
  imports: [ConfigModule.forFeature(uploadConfig)],
  controllers: [UploadController],
  providers: [
    UploadService,
    LocalStorageProvider,
    S3StorageProvider,
    {
      provide: 'STORAGE_PROVIDER',
      inject: [ConfigService, LocalStorageProvider, S3StorageProvider],
      useFactory: (
        configService: ConfigService,
        local: LocalStorageProvider,
        s3: S3StorageProvider,
      ) => {
        const providerType =
          configService.get<string>('STORAGE_PROVIDER') || 'local';
        return providerType.toLowerCase() === 's3' ? s3 : local;
      },
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}

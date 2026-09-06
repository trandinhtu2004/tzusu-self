import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { setServers } from 'node:dns';

function configureDnsServers(configService: ConfigService) {
  const dnsServers = configService
    .get<string>('NODE_DNS_SERVERS')
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    setServers(dnsServers);
  }
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        configureDnsServers(configService);

        return {
          uri: configService.getOrThrow<string>('MONGODB_URI'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}

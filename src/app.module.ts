import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'
import { AuthenticateController } from './controllers/authenticate.controller'

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (objWithEnv) => envSchema.parse(objWithEnv),
			isGlobal: true,
		}),
		AuthModule,
	],
	controllers: [AuthenticateController, CreateAccountController],
	providers: [PrismaService],
})
export class AppModule {}

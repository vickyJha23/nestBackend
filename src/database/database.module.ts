import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";


@Module({
     imports: [
        MongooseModule.forRootAsync({
            // it will be injected in the ConfigService
             inject: [ConfigService],
             // thisfactory is used to make the connections with mongodb
             useFactory: (config: ConfigService) =>({
                  uri: config.get<string>('database.uri')
             }) 
        })
     ]
})

export class DatabaseModule {}
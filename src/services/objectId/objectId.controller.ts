import { Controller, Get } from '@nestjs/common';
import { ObjectID } from 'bson';

@Controller('user-token')
export class ObjectIdController {
  @Get()
  createObjectId(): { status: boolean; data: string } {
    const objectId = new ObjectID().toString();
    return { status: true, data: objectId };
  }
}

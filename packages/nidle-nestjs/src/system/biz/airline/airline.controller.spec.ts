import { Test, TestingModule } from '@nestjs/testing';
import { AirlinePublishController } from './airline_publish.controller';
import { AirlinePublishService } from './airline_publish.service';

describe('AirlineController', () => {
  let controller: AirlinePublishController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlinePublishController],
      providers: [AirlinePublishService],
    }).compile();

    controller = module.get<AirlinePublishController>(AirlinePublishController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

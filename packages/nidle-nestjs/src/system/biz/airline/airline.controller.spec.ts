import { Test, TestingModule } from '@nestjs/testing';
import { AirlineController } from './airline_publish.controller';
import { AirlineService } from './airline_publish.service';

describe('AirlineController', () => {
  let controller: AirlineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlineController],
      providers: [AirlineService],
    }).compile();

    controller = module.get<AirlineController>(AirlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

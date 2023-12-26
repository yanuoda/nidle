import { Test, TestingModule } from '@nestjs/testing';
import { AirlinePublishService } from './airline_publish.service';

describe('AirlineService', () => {
  let service: AirlinePublishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirlinePublishService],
    }).compile();

    service = module.get<AirlinePublishService>(AirlinePublishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

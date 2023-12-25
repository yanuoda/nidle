import { Test, TestingModule } from '@nestjs/testing';
import { ApiauthService } from './apiauth.service';

describe('ApiauthService', () => {
  let service: ApiauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiauthService],
    }).compile();

    service = module.get<ApiauthService>(ApiauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

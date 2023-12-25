import { Test, TestingModule } from '@nestjs/testing';
import { ApiauthController } from './apiauth.controller';
import { ApiauthService } from './apiauth.service';

describe('ApiauthController', () => {
  let controller: ApiauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiauthController],
      providers: [ApiauthService],
    }).compile();

    controller = module.get<ApiauthController>(ApiauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

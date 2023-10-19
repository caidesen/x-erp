import { Module } from "@nestjs/common";
import { CodeService } from "@/modules/system/code/code.service";

@Module({
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}

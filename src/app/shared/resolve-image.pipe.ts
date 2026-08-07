import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '@/layout/service/common';

@Pipe({ name: 'resolveImage', standalone: true })
export class ResolveImagePipe implements PipeTransform {
  private commonService = new CommonService();

  transform(path: string | null | undefined): string {
    return this.commonService.resolveImageUrl(path);
  }
}

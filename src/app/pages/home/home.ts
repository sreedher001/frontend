import { Component, OnInit } from '@angular/core';
import { SeoService } from '@/seo/seo.service';
import { StoreSettingsService } from '@/store-settings/store-settings.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  constructor(private seoService: SeoService, public storeSettingsService: StoreSettingsService) {}

  get fullAddress(): string {
    const s = this.storeSettingsService.current;
    return [s.addressLine, s.city, s.state, s.country].filter((v) => !!v).join(', ');
  }

  ngOnInit(): void {
    const settings = this.storeSettingsService.current;
    this.seoService.update({
      title: 'About Us',
      description: settings.aboutDescription || settings.seoDescription
    });
  }
}

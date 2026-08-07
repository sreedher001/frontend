import { Component, OnInit } from '@angular/core';
import { SeoService } from '@/seo/seo.service';
import { StoreSettingsService } from '@/store-settings/store-settings.service';

@Component({
  selector: 'app-termsandconditions',
  imports: [],
  templateUrl: './termsandconditions.html',
  styleUrl: './termsandconditions.scss'
})
export class Termsandconditions implements OnInit {
  constructor(private seoService: SeoService, public storeSettingsService: StoreSettingsService) {}

  get fullAddress(): string {
    const s = this.storeSettingsService.current;
    return [s.addressLine, s.city, s.state, s.country].filter((v) => !!v).join(', ');
  }

  ngOnInit(): void {
    this.seoService.update({
      title: 'Terms, Privacy & Policies',
      description: `Read the terms of service, privacy policy, shipping policy, and refund policy for ${this.storeSettingsService.current.storeName}.`
    });
  }
}

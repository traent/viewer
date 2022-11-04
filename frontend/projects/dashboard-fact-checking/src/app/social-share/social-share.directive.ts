import { Directive, HostListener, Input } from '@angular/core';

/**
 * Inspired by https://github.com/alexburykin/ngx-social-share
 */
@Directive({ selector: '[appSocialShare]' })
export class SocialShareDirective {

  @Input('appSocialShare') socialShare?: string;
  @Input() url? = encodeURIComponent(window.location.href);

  @HostListener('click') onMouseEnter() {
    switch (this.socialShare) {
      case 'fb':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.url}`);
        break;
      case 'tw':
        window.open(`https://twitter.com/intent/tweet?text=${this.url}`);
        break;
      case 'in':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${this.url}`);
        break;
      case 'tr':
        window.open(`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${this.url}`);
        break;
      case 'dg':
        window.open(`http://digg.com/submit?url=${this.url}`);
        break;
      case 'rd':
        window.open(`https://reddit.com/submit?url=${this.url}`);
        break;
      case 'pn':
        window.open(`https://www.pinterest.com/pin/find/?url=${this.url}`);
        break;
      default:
        break;
    }
  }
}

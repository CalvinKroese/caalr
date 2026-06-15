// Live in-browser preview templates for the CAALR editor.
// Renders entries using the SAME class names as the real site pages, so with
// the site CSS registered above the preview closely matches the published page.
// Runs entirely client-side — no builds, no commits, no deploys.
(function () {
  var h = window.h;
  var createClass = window.createClass;
  if (!h || !createClass) {
    console.error('[preview] Decap globals h/createClass missing — preview templates not registered');
    return;
  }

  function toArr(v) {
    if (!v) return [];
    return typeof v.toJS === 'function' ? v.toJS() : v;
  }

  function fmtDate(v) {
    if (!v) return '';
    var d = new Date(v);
    return isNaN(d) ? String(v) : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function mkImg(getAsset, path, className, alt, style) {
    if (!path) return null;
    var props = { src: getAsset(path), alt: alt || '' };
    if (className) props.className = className;
    if (style) props.style = style;
    return h('img', props);
  }

  var ArtistPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data').toJS();
      var g = this.props.getAsset;
      var mediums = toArr(data.mediums);
      return h('section', { className: 'section' },
        h('div', { className: 'container artist-profile' },
          h('div', { className: 'artist-profile__header' },
            h('div', { className: 'artist-profile__photo-wrap' },
              mkImg(g, data.featuredImage, 'artist-profile__photo', 'Photo of ' + (data.name || '')),
              data.photoIsTemp ? h('span', { className: 'artist-profile__temp-badge' }, 'Photo Coming Soon') : null
            ),
            h('div', { className: 'artist-profile__info' },
              h('h1', {}, data.name || 'Artist name'),
              h('div', { className: 'artist-profile__mediums' },
                mediums.map(function (m, i) { return h('span', { className: 'badge', key: i }, m); })
              ),
              (data.isBoardMember && data.boardRole) ? h('p', { className: 'text-muted' }, 'CAALR Board — ' + data.boardRole) : null,
              h('div', { className: 'artist-profile__contact' },
                data.email ? h('a', { href: 'mailto:' + data.email }, data.email) : null,
                data.website ? h('a', { href: data.website }, 'Website') : null,
                data.instagram ? h('a', { href: data.instagram }, 'Instagram') : null,
                data.facebook ? h('a', { href: data.facebook }, 'Facebook') : null
              )
            )
          ),
          h('div', { className: 'artist-profile__bio prose' }, this.props.widgetFor('body')),
          h('div', { className: 'artist-profile__gallery' },
            h('h2', {}, 'Artwork by ' + (data.name || '')),
            h('p', { className: 'text-muted' },
              'Artwork shows here from the Gallery — add a photo in the Gallery section and set its “Artist” to this person.')
          )
        )
      );
    }
  });

  var EventPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data').toJS();
      var g = this.props.getAsset;
      var photos = toArr(data.galleryImages);
      var upcoming = data.startDate ? (new Date(data.startDate) >= new Date()) : false;
      var dateLine = fmtDate(data.startDate);
      if (data.endDate && data.endDate !== data.startDate) dateLine += ' — ' + fmtDate(data.endDate);
      return h('section', { className: 'section' },
        h('div', { className: 'container event-detail' },
          h('div', { className: 'event-detail__header' },
            h('span', { className: 'badge' + (upcoming ? ' badge--upcoming' : '') }, upcoming ? 'Upcoming' : 'Past'),
            h('h1', {}, data.title || 'Event name'),
            h('div', { className: 'event-detail__meta' },
              h('p', {}, h('strong', {}, 'Date: '), dateLine),
              h('p', {}, h('strong', {}, 'Venue: '), data.venueName || ''),
              data.venueAddress ? h('p', {}, data.venueAddress) : null
            )
          ),
          mkImg(g, data.featuredImage, 'event-detail__image', data.title || ''),
          h('div', { className: 'prose' }, this.props.widgetFor('body')),
          photos.length ? h('div', { className: 'event-detail__photos' },
            h('h2', {}, 'Event Photos'),
            h('div', { className: 'grid grid--3' },
              photos.map(function (p, i) { return mkImg(g, p, 'card__image', 'Event photo', { borderRadius: 'var(--radius-card)' }); })
            )
          ) : null
        )
      );
    }
  });

  var NewsPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data').toJS();
      var g = this.props.getAsset;
      return h('section', { className: 'section' },
        h('div', { className: 'container', style: { maxWidth: '800px' } },
          h('h1', {}, data.title || 'Headline'),
          h('p', { className: 'text-muted' }, fmtDate(data.date)),
          data.sourceName ? h('p', { className: 'text-muted' }, 'Source: ' + data.sourceName) : null,
          mkImg(g, data.featuredImage, null, data.title || '', { width: '100%', borderRadius: 'var(--radius-card)', margin: 'var(--space-md) 0' }),
          h('div', { className: 'prose', style: { marginTop: 'var(--space-md)' } }, this.props.widgetFor('body'))
        )
      );
    }
  });

  var GalleryPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data').toJS();
      var g = this.props.getAsset;
      return h('section', { className: 'section' },
        h('div', { className: 'container', style: { maxWidth: '720px', textAlign: 'center' } },
          h('h1', {}, data.title || 'Artwork title'),
          mkImg(g, data.image, null, data.alt || '', { width: '100%', borderRadius: 'var(--radius-card)', margin: 'var(--space-md) 0' }),
          data.year ? h('p', { className: 'text-muted' }, String(data.year)) : null,
          data.artistSlug ? h('p', { className: 'text-muted' }, 'Artist: ' + data.artistSlug) : null
        )
      );
    }
  });

  // Pages collection holds three shapes (Home, About, section headers); branch on
  // which fields are present so each gets a readable preview.
  var PagesPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data').toJS();
      var w = this.props.widgetFor;
      var g = this.props.getAsset;
      var thumb = { height: '90px', width: '120px', objectFit: 'cover', borderRadius: '6px' };
      // About page
      if (data.missionBody !== undefined || data.membershipBody !== undefined) {
        return h('section', { className: 'section' },
          h('div', { className: 'container' },
            data.heroScript ? h('p', { className: 'text-muted', style: { fontStyle: 'italic' } }, data.heroScript) : null,
            h('h1', {}, data.heroTitle || 'About'),
            data.heroSubtitle ? h('p', { className: 'text-muted' }, data.heroSubtitle) : null,
            toArr(data.bannerPhotos).length
              ? h('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', margin: 'var(--space-sm) 0' } },
                  toArr(data.bannerPhotos).map(function (src) { return mkImg(g, src, null, '', thumb); }))
              : null,
            h('h2', { style: { marginTop: 'var(--space-lg)' } }, data.missionTitle || 'Our Mission'),
            data.missionPhoto ? mkImg(g, data.missionPhoto, null, '', { width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radius-card)', margin: 'var(--space-sm) 0' }) : null,
            h('div', { className: 'prose' }, w('missionBody')),
            h('h2', { style: { marginTop: 'var(--space-lg)' } }, data.membershipTitle || 'Membership'),
            h('div', { className: 'prose' }, w('membershipBody')),
            data.sidebarPhoto ? mkImg(g, data.sidebarPhoto, null, '', { width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radius-card)', margin: 'var(--space-md) 0' }) : null
          )
        );
      }
      // Home page
      if (data.heroEyebrow !== undefined || data.storyTitle !== undefined) {
        return h('section', { className: 'section' },
          h('div', { className: 'container' },
            data.heroEyebrow ? h('p', { className: 'text-muted', style: { fontStyle: 'italic' } }, data.heroEyebrow) : null,
            h('h1', {}, data.heroTitle || ''),
            data.heroText ? h('p', { className: 'text-muted' }, data.heroText) : null,
            h('p', { className: 'text-muted', style: { fontStyle: 'italic', marginTop: 'var(--space-md)' } }, '(The top photo slideshow rotates automatically from your Gallery.)'),
            h('h2', { style: { marginTop: 'var(--space-lg)' } }, data.storyTitle || 'Our Story'),
            h('div', { className: 'prose' }, w('introText'))
          )
        );
      }
      // Section-header pages (Artists / Events / News / Gallery)
      return h('section', { className: 'section' },
        h('div', { className: 'container', style: { textAlign: 'center' } },
          data.heroScript ? h('p', { className: 'text-muted', style: { fontStyle: 'italic' } }, data.heroScript) : null,
          h('h1', {}, data.heroTitle || ''),
          data.heroSubtitle ? h('p', { className: 'text-muted' }, data.heroSubtitle) : null,
          h('p', { className: 'text-muted', style: { marginTop: 'var(--space-md)' } }, 'This is the banner at the top of the page; the rest of the page is generated automatically.')
        )
      );
    }
  });

  CMS.registerPreviewTemplate('artists', ArtistPreview);
  CMS.registerPreviewTemplate('events', EventPreview);
  CMS.registerPreviewTemplate('news', NewsPreview);
  CMS.registerPreviewTemplate('gallery', GalleryPreview);
  // "pages" is a files collection — Decap registers its preview by each FILE name.
  ['pages', 'home', 'about', 'artists_page', 'events_page', 'news_page', 'gallery_page'].forEach(function (n) {
    CMS.registerPreviewTemplate(n, PagesPreview);
  });
})();

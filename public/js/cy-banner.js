/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ "./iab-tcf-core/Cloneable.js":
      /*!***********************************!*\
  !*** ./iab-tcf-core/Cloneable.js ***!
  \***********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Cloneable: () => /* binding */ Cloneable,
          /* harmony export */
        });
        /**
         * Abstract Class Cloneable<T> can be extended to give the child class the ability to clone its self.
         * The child class must pass its class to super. You can then pass any needed arguments to help build
         * the cloned class to the protected _clone() method.
         *
         * Example:
         *
         * class Example extends Cloneable<Example> {
         *
         * }
         * Todo: There must be more non primitive build in types to check. But for our current purposes, this works great.
         */
        class Cloneable {
          /**
           * clone - returns a copy of the classes with new values and not references
           *
           * @return {T}
           */
          clone() {
            const myClone = new this.constructor();
            const keys = Object.keys(this);
            keys.forEach((key) => {
              const value = this.deepClone(this[key]);

              if (value !== undefined) {
                myClone[key] = value;
              }
            });
            return myClone;
          }
          /**
           * deepClone - recursive function that makes copies of reference values
           *
           * @param {unknown} item
           * @return {unknown}
           */

          deepClone(item) {
            const itsType = typeof item;

            if (
              itsType === "number" ||
              itsType === "string" ||
              itsType === "boolean"
            ) {
              return item;
            } else if (item !== null && itsType === "object") {
              if (typeof item.clone === "function") {
                return item.clone();
              } else if (item instanceof Date) {
                return new Date(item.getTime());
              } else if (item[Symbol.iterator] !== undefined) {
                const ar = [];

                for (const subItem of item) {
                  ar.push(this.deepClone(subItem));
                }

                if (item instanceof Array) {
                  return ar;
                } else {
                  return new item.constructor(ar);
                }
              } else {
                const retr = {};

                for (const prop in item) {
                  if (item.hasOwnProperty(prop)) {
                    retr[prop] = this.deepClone(item[prop]);
                  }
                }

                return retr;
              }
            }
            /**
             * ignore functions because those will be initialized with the cloning
             * process
             */
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/GVL.js":
      /*!*****************************!*\
  !*** ./iab-tcf-core/GVL.js ***!
  \*****************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ GVL: () => /* binding */ GVL,
          /* harmony export */
        });
        /* harmony import */ var _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./Cloneable.js */ "./iab-tcf-core/Cloneable.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _Json_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./Json.js */ "./iab-tcf-core/Json.js");
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./model/index.js */ "./iab-tcf-core/model/index.js"
          );

        /**
         * class with utilities for managing the global vendor list.  Will use JSON to
         * fetch the vendor list from specified url and will serialize it into this
         * object and provide accessors.  Provides ways to group vendors on the list by
         * purpose and feature.
         */

        class GVL extends _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__.Cloneable {
          static LANGUAGE_CACHE = new Map();
          static CACHE = new Map();
          static LATEST_CACHE_KEY = 0;
          static DEFAULT_LANGUAGE = "EN";
          /**
           * Set of available consent languages published by the IAB
           */

          static consentLanguages =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.ConsentLanguages();
          static baseUrl_;
          /**
           * baseUrl - Entities using the vendor-list.json are required by the iab to
           * host their own copy of it to reduce the load on the iab's infrastructure
           * so a 'base' url must be set to be put together with the versioning scheme
           * of the filenames.
           *
           * @static
           * @param {string} url - the base url to load the vendor-list.json from.  This is
           * broken out from the filename because it follows a different scheme for
           * latest file vs versioned files.
           *
           * @throws {GVLError} - If the url is http[s]://vendorlist.consensu.org/...
           * this will throw an error.  IAB Europe requires that that CMPs and Vendors
           * cache their own copies of the GVL to minimize load on their
           * infrastructure.  For more information regarding caching of the
           * vendor-list.json, please see [the TCF documentation on 'Caching the Global
           * Vendor List'
           * ](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md#caching-the-global-vendor-list)
           */

          static set baseUrl(url) {
            const notValid = /^https?:\/\/vendorlist\.consensu\.org\//;

            if (notValid.test(url)) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.GVLError(
                "Invalid baseUrl!  You may not pull directly from vendorlist.consensu.org and must provide your own cache"
              );
            } // if a trailing slash was forgotten

            if (url.length > 0 && url[url.length - 1] !== "/") {
              url += "/";
            }

            this.baseUrl_ = url;
          }
          /**
           * baseUrl - Entities using the vendor-list.json are required by the iab to
           * host their own copy of it to reduce the load on the iab's infrastructure
           * so a 'base' url must be set to be put together with the versioning scheme
           * of the filenames.
           *
           * @static
           * @return {string} - returns the previously set baseUrl, the default is
           * `undefined`
           */

          static get baseUrl() {
            return this.baseUrl_;
          }
          /**
           * @static
           * @param {string} - the latest is assumed to be vendor-list.json because
           * that is what the iab uses, but it could be different... if you want
           */

          static latestFilename = "vendor-list.json";
          /**
           * @static
           * @param {string} - the versioned name is assumed to be
           * vendor-list-v[VERSION].json where [VERSION] will be replaced with the
           * specified version.  But it could be different... if you want just make
           * sure to include the [VERSION] macro if you have a numbering scheme, it's a
           * simple string substitution.
           *
           * eg.
           * ```javascript
           * GVL.baseUrl = "http://www.mydomain.com/iabcmp/";
           * GVL.versionedFilename = "vendorlist?getVersion=[VERSION]";
           * ```
           */

          static versionedFilename = "archives/vendor-list-v[VERSION].json";
          /**
           * @param {string} - Translations of the names and descriptions for Purposes,
           * Special Purposes, Features, and Special Features to non-English languages
           * are contained in a file where attributes containing English content
           * (except vendor declaration information) are translated.  The iab publishes
           * one following the scheme below where the LANG is the iso639-1 language
           * code.  For a list of available translations
           * [please go here](https://register.consensu.org/Translation).
           *
           * eg.
           * ```javascript
           * GVL.baseUrl = "http://www.mydomain.com/iabcmp/";
           * GVL.languageFilename = "purposes?getPurposes=[LANG]";
           * ```
           */

          static languageFilename = "purposes-[LANG].json";
          /**
           * @param {Promise} resolved when this GVL object is populated with the data
           * or rejected if there is an error.
           */

          readyPromise;
          /**
           * @param {number} gvlSpecificationVersion - schema version for the GVL that is used
           */

          gvlSpecificationVersion;
          /**
           * @param {number} incremented with each published file change
           */

          vendorListVersion;
          /**
           * @param {number} tcfPolicyVersion - The TCF MO will increment this value
           * whenever a GVL change (such as adding a new Purpose or Feature or a change
           * in Purpose wording) legally invalidates existing TC Strings and requires
           * CMPs to re-establish transparency and consent from users. If the policy
           * version number in the latest GVL is different from the value in your TC
           * String, then you need to re-establish transparency and consent for that
           * user. A version 1 format TC String is considered to have a version value
           * of 1.
           */

          tcfPolicyVersion;
          /**
           * @param {string | Date} lastUpdated - the date in which the vendor list
           * json file  was last updated.
           */

          lastUpdated;
          /**
           * @param {IntMap<Purpose>} a collection of [[Purpose]]s
           */

          purposes;
          /**
           * @param {IntMap<Purpose>} a collection of [[Purpose]]s
           */

          specialPurposes;
          /**
           * @param {IntMap<Feature>} a collection of [[Feature]]s
           */

          features;
          /**
           * @param {IntMap<Feature>} a collection of [[Feature]]s
           */

          specialFeatures;
          /**
           * @param {boolean} internal reference of when the GVL is ready to be used
           */

          isReady_ = false;
          /**
           * @param {IntMap<Vendor>} a collection of [[Vendor]]s
           */

          vendors_;
          vendorIds;
          /**
           * @param {IntMap<Vendor>} a collection of [[Vendor]]. Used as a backup if a whitelist is sets
           */

          fullVendorList;
          /**
           * @param {IntMap<GoogleVendor>} a collection of [[GoogleVendor]]s
           */

          googleVendors_;
          googleVendorIds;
          /**
           * @param {IntMap<GoogleVendor>} a collection of [[GoogleVendor]]. Used as a backup if a whitelist is sets
           */

          fullGoogleVendorList;
          /**
           * @param {ByPurposeVendorMap} vendors by purpose
           */

          byPurposeVendorMap;
          /**
           * @param {IDSetMap} vendors by special purpose
           */

          bySpecialPurposeVendorMap;
          /**
           * @param {IDSetMap} vendors by feature
           */

          byFeatureVendorMap;
          /**
           * @param {IDSetMap} vendors by special feature
           */

          bySpecialFeatureVendorMap;
          /**
           * @param {IntMap<Stack>} a collection of [[Stack]]s
           */

          stacks;
          /**
           * @param {IntMap<DataCategory>} a collection of [[DataCategory]]s
           */

          dataCategories;
          lang_;
          cacheLang_;
          isLatest = false;
          /**
           * @param {VersionOrVendorList} [versionOrVendorList] - can be either a
           * [[VendorList]] object or a version number represented as a string or
           * number to download.  If nothing is passed the latest version of the GVL
           * will be loaded
           * @param {GvlCreationOptions} [options] - it is an optional object where the default language can be set
           */

          constructor(versionOrVendorList, options) {
            super();
            /**
             * should have been configured before and instance was created and will
             * persist through the app
             */

            let url = GVL.baseUrl;
            let parsedLanguage = options?.language;

            if (parsedLanguage) {
              try {
                parsedLanguage =
                  GVL.consentLanguages.parseLanguage(parsedLanguage);
              } catch (e) {
                throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.GVLError(
                  "Error during parsing the language: " + e.message
                );
              }
            }

            this.lang_ = parsedLanguage || GVL.DEFAULT_LANGUAGE;
            this.cacheLang_ = parsedLanguage || GVL.DEFAULT_LANGUAGE;

            if (this.isVendorList(versionOrVendorList)) {
              this.populate(versionOrVendorList);
              this.readyPromise = Promise.resolve();
            } else {
              if (!url) {
                throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.GVLError(
                  "must specify GVL.baseUrl before loading GVL json"
                );
              }

              if (versionOrVendorList > 0) {
                const version = versionOrVendorList;

                if (GVL.CACHE.has(version)) {
                  this.populate(GVL.CACHE.get(version));
                  this.readyPromise = Promise.resolve();
                } else {
                  // load version specified
                  url += GVL.versionedFilename.replace(
                    "[VERSION]",
                    String(version)
                  );
                  this.readyPromise = this.fetchJson(url);
                }
              } else {
                /**
                 * whatever it is (or isn't)... it doesn't matter we'll just get the
                 * latest. In this case we may have cached the latest version at key 0.
                 * If we have then we'll just use that instead of making a request.
                 * Otherwise we'll have to load it (and then we'll cache it for next
                 * time)
                 */
                if (GVL.CACHE.has(GVL.LATEST_CACHE_KEY)) {
                  this.populate(GVL.CACHE.get(GVL.LATEST_CACHE_KEY));
                  this.readyPromise = Promise.resolve();
                } else {
                  this.isLatest = true;
                  this.readyPromise = this.fetchJson(url + GVL.latestFilename);
                }
              }
            }
          }
          /**
           * emptyLanguageCache
           *
           * @param {string} [lang] - Optional language code to remove from
           * the cache.  Should be one of the languages in GVL.consentLanguages set.
           * If not then the whole cache will be deleted.
           * @return {boolean} - true if anything was deleted from the cache
           */

          static emptyLanguageCache(lang) {
            let result = false;

            if (lang == null && GVL.LANGUAGE_CACHE.size > 0) {
              GVL.LANGUAGE_CACHE = new Map();
              result = true;
            } else if (
              typeof lang === "string" &&
              this.consentLanguages.has(lang.toUpperCase())
            ) {
              GVL.LANGUAGE_CACHE.delete(lang.toUpperCase());
              result = true;
            }

            return result;
          }
          /**
           * emptyCache
           *
           * @param {number} [vendorListVersion] - version of the vendor list to delete
           * from the cache.  If none is specified then the whole cache is deleted.
           * @return {boolean} - true if anything was deleted from the cache
           */

          static emptyCache(vendorListVersion) {
            let retr = false;

            if (Number.isInteger(vendorListVersion) && vendorListVersion >= 0) {
              GVL.CACHE.delete(vendorListVersion);
              retr = true;
            } else if (vendorListVersion === undefined) {
              GVL.CACHE = new Map();
              retr = true;
            }

            return retr;
          }

          cacheLanguage() {
            if (!GVL.LANGUAGE_CACHE.has(this.cacheLang_)) {
              GVL.LANGUAGE_CACHE.set(this.cacheLang_, {
                purposes: this.purposes,
                specialPurposes: this.specialPurposes,
                features: this.features,
                specialFeatures: this.specialFeatures,
                stacks: this.stacks,
                dataCategories: this.dataCategories,
              });
            }
          }

          async fetchJson(url) {
            try {
              this.populate(
                await _Json_js__WEBPACK_IMPORTED_MODULE_2__.Json.fetch(url)
              );
            } catch (err) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.GVLError(
                err.message
              );
            }
          }
          /**
           * getJson - Method for getting the JSON that was downloaded to created this
           * `GVL` object
           *
           * @return {VendorList} - The basic JSON structure without the extra
           * functionality and methods of this class.
           */

          getJson() {
            return {
              gvlSpecificationVersion: this.gvlSpecificationVersion,
              vendorListVersion: this.vendorListVersion,
              tcfPolicyVersion: this.tcfPolicyVersion,
              lastUpdated: this.lastUpdated,
              purposes: this.clonePurposes(),
              specialPurposes: this.cloneSpecialPurposes(),
              features: this.cloneFeatures(),
              specialFeatures: this.cloneSpecialFeatures(),
              stacks: this.cloneStacks(),
              ...(this.dataCategories
                ? {
                    dataCategories: this.cloneDataCategories(),
                  }
                : {}),
              vendors: this.cloneVendors(),
              googleVendors: this.googleVendors,
            };
          }

          cloneSpecialFeatures() {
            const features = {};

            for (const featureId of Object.keys(this.specialFeatures)) {
              features[featureId] = GVL.cloneFeature(
                this.specialFeatures[featureId]
              );
            }

            return features;
          }

          cloneFeatures() {
            const features = {};

            for (const featureId of Object.keys(this.features)) {
              features[featureId] = GVL.cloneFeature(this.features[featureId]);
            }

            return features;
          }

          cloneStacks() {
            const stacks = {};

            for (const stackId of Object.keys(this.stacks)) {
              stacks[stackId] = GVL.cloneStack(this.stacks[stackId]);
            }

            return stacks;
          }

          cloneDataCategories() {
            const dataCategories = {};

            for (const dataCategoryId of Object.keys(this.dataCategories)) {
              dataCategories[dataCategoryId] = GVL.cloneDataCategory(
                this.dataCategories[dataCategoryId]
              );
            }

            return dataCategories;
          }

          cloneSpecialPurposes() {
            const purposes = {};

            for (const purposeId of Object.keys(this.specialPurposes)) {
              purposes[purposeId] = GVL.clonePurpose(
                this.specialPurposes[purposeId]
              );
            }

            return purposes;
          }

          clonePurposes() {
            const purposes = {};

            for (const purposeId of Object.keys(this.purposes)) {
              purposes[purposeId] = GVL.clonePurpose(this.purposes[purposeId]);
            }

            return purposes;
          }

          static clonePurpose(purpose) {
            return {
              id: purpose.id,
              name: purpose.name,
              description: purpose.description,
              ...(purpose.descriptionLegal
                ? {
                    descriptionLegal: purpose.descriptionLegal,
                  }
                : {}),
              ...(purpose.illustrations
                ? {
                    illustrations: Array.from(purpose.illustrations),
                  }
                : {}),
            };
          }

          static cloneFeature(feature) {
            return {
              id: feature.id,
              name: feature.name,
              description: feature.description,
              ...(feature.descriptionLegal
                ? {
                    descriptionLegal: feature.descriptionLegal,
                  }
                : {}),
              ...(feature.illustrations
                ? {
                    illustrations: Array.from(feature.illustrations),
                  }
                : {}),
            };
          }

          static cloneDataCategory(dataCategory) {
            return {
              id: dataCategory.id,
              name: dataCategory.name,
              description: dataCategory.description,
            };
          }

          static cloneStack(stack) {
            return {
              id: stack.id,
              name: stack.name,
              description: stack.description,
              purposes: Array.from(stack.purposes),
              specialFeatures: Array.from(stack.specialFeatures),
            };
          }

          static cloneDataRetention(dataRetention) {
            return {
              ...(typeof dataRetention.stdRetention === "number"
                ? {
                    stdRetention: dataRetention.stdRetention,
                  }
                : {}),
              purposes: { ...dataRetention.purposes },
              specialPurposes: { ...dataRetention.specialPurposes },
            };
          }

          static cloneVendorUrls(urls) {
            return urls.map((url) => ({
              langId: url.langId,
              privacy: url.privacy,
              ...(url.legIntClaim
                ? {
                    legIntClaim: url.legIntClaim,
                  }
                : {}),
            }));
          }

          static cloneVendor(vendor) {
            return {
              id: vendor.id,
              name: vendor.name,
              purposes: Array.from(vendor.purposes),
              legIntPurposes: Array.from(vendor.legIntPurposes),
              flexiblePurposes: Array.from(vendor.flexiblePurposes),
              specialPurposes: Array.from(vendor.specialPurposes),
              features: Array.from(vendor.features),
              specialFeatures: Array.from(vendor.specialFeatures),
              ...(vendor.overflow
                ? {
                    overflow: {
                      httpGetLimit: vendor.overflow.httpGetLimit,
                    },
                  }
                : {}),
              ...(typeof vendor.cookieMaxAgeSeconds === "number" ||
              vendor.cookieMaxAgeSeconds === null
                ? {
                    cookieMaxAgeSeconds: vendor.cookieMaxAgeSeconds,
                  }
                : {}),
              ...(vendor.usesCookies !== undefined
                ? {
                    usesCookies: vendor.usesCookies,
                  }
                : {}),
              ...(vendor.policyUrl
                ? {
                    policyUrl: vendor.policyUrl,
                  }
                : {}),
              ...(vendor.cookieRefresh !== undefined
                ? {
                    cookieRefresh: vendor.cookieRefresh,
                  }
                : {}),
              ...(vendor.usesNonCookieAccess !== undefined
                ? {
                    usesNonCookieAccess: vendor.usesNonCookieAccess,
                  }
                : {}),
              ...(vendor.dataRetention
                ? {
                    dataRetention: this.cloneDataRetention(
                      vendor.dataRetention
                    ),
                  }
                : {}),
              ...(vendor.urls
                ? {
                    urls: this.cloneVendorUrls(vendor.urls),
                  }
                : {}),
              ...(vendor.dataDeclaration
                ? {
                    dataDeclaration: Array.from(vendor.dataDeclaration),
                  }
                : {}),
              ...(vendor.deviceStorageDisclosureUrl
                ? {
                    deviceStorageDisclosureUrl:
                      vendor.deviceStorageDisclosureUrl,
                  }
                : {}),
              ...(vendor.deletedDate
                ? {
                    deletedDate: vendor.deletedDate,
                  }
                : {}),
            };
          }

          cloneVendors() {
            const vendors = {};

            for (const vendorId of Object.keys(this.fullVendorList)) {
              vendors[vendorId] = GVL.cloneVendor(
                this.fullVendorList[vendorId]
              );
            }

            return vendors;
          }
          /**
           * changeLanguage - retrieves the purpose language translation and sets the
           * internal language variable
           *
           * @param {string} lang - language code to change language to
           * @return {Promise<void | GVLError>} - returns the `readyPromise` and
           * resolves when this GVL is populated with the data from the language file.
           */

          async changeLanguage(lang) {
            let parsedLanguage = lang;

            try {
              parsedLanguage = GVL.consentLanguages.parseLanguage(lang);
            } catch (e) {
              return;
            }

            const cacheLang = lang.toUpperCase(); // Default language EN can be loaded only by default GVL

            if (
              parsedLanguage.toLowerCase() ===
                GVL.DEFAULT_LANGUAGE.toLowerCase() &&
              !GVL.LANGUAGE_CACHE.has(cacheLang)
            ) {
              return;
            }

            if (parsedLanguage !== this.lang_) {
              this.lang_ = parsedLanguage;

              if (GVL.LANGUAGE_CACHE.has(cacheLang)) {
                const cached = GVL.LANGUAGE_CACHE.get(cacheLang);

                for (const prop in cached) {
                  if (cached.hasOwnProperty(prop)) {
                    this[prop] = cached[prop];
                  }
                }
              } else {
                // load Language specified
                const url =
                  GVL.baseUrl +
                  GVL.languageFilename.replace(
                    "[LANG]",
                    this.lang_.toLowerCase()
                  );

                try {
                  await this.fetchJson(url);
                  this.cacheLang_ = cacheLang;
                  this.cacheLanguage();
                } catch (err) {
                  throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.GVLError(
                    "unable to load language: " + err.message
                  );
                }
              }
            }
          }

          get language() {
            return this.lang_;
          }

          isVendorList(gvlObject) {
            return gvlObject !== undefined && gvlObject.vendors !== undefined;
          }

          populate(gvlObject) {
            /**
             * these are populated regardless of whether it's a Declarations file or
             * a VendorList
             */
            this.purposes = gvlObject.purposes;
            this.specialPurposes = gvlObject.specialPurposes;
            this.features = gvlObject.features;
            this.specialFeatures = gvlObject.specialFeatures;
            this.stacks = gvlObject.stacks;
            this.dataCategories = gvlObject.dataCategories;

            if (this.isVendorList(gvlObject)) {
              this.gvlSpecificationVersion = gvlObject.gvlSpecificationVersion;
              this.tcfPolicyVersion = gvlObject.tcfPolicyVersion;
              this.vendorListVersion = gvlObject.vendorListVersion;
              this.lastUpdated = gvlObject.lastUpdated;

              if (typeof this.lastUpdated === "string") {
                this.lastUpdated = new Date(this.lastUpdated);
              }

              this.vendors_ = gvlObject.vendors;
              this.fullVendorList = gvlObject.vendors;
              this.googleVendors_ = gvlObject.googleVendors;
              this.fullGoogleVendorList = gvlObject.googleVendors;
              this.mapVendors();
              this.mapGoogleVendors();
              this.isReady_ = true;

              if (this.isLatest) {
                /**
                 * If the "LATEST" was requested then this flag will be set to true.
                 * In that case we'll cache the GVL at the special key
                 */
                GVL.CACHE.set(GVL.LATEST_CACHE_KEY, this.getJson());
              }
              /**
               * Whether or not it's the "LATEST" we'll cache the gvl at the version it
               * is declared to be (if it's not already). to avoid downloading it again
               * in the future.
               */

              if (!GVL.CACHE.has(this.vendorListVersion)) {
                GVL.CACHE.set(this.vendorListVersion, this.getJson());
              }
            }

            this.cacheLanguage();
          }

          mapVendors(vendorIds) {
            // create new instances of the maps
            this.byPurposeVendorMap = {};
            this.bySpecialPurposeVendorMap = {};
            this.byFeatureVendorMap = {};
            this.bySpecialFeatureVendorMap = {}; // initializes data structure for purpose map

            Object.keys(this.purposes).forEach((purposeId) => {
              this.byPurposeVendorMap[purposeId] = {
                legInt: new Set(),
                consent: new Set(),
                flexible: new Set(),
              };
            }); // initializes data structure for special purpose map

            Object.keys(this.specialPurposes).forEach((purposeId) => {
              this.bySpecialPurposeVendorMap[purposeId] = new Set();
            }); // initializes data structure for feature map

            Object.keys(this.features).forEach((featureId) => {
              this.byFeatureVendorMap[featureId] = new Set();
            }); // initializes data structure for feature map

            Object.keys(this.specialFeatures).forEach((featureId) => {
              this.bySpecialFeatureVendorMap[featureId] = new Set();
            });

            if (!Array.isArray(vendorIds)) {
              vendorIds = Object.keys(this.fullVendorList).map((vId) => +vId);
            }

            this.vendorIds = new Set(vendorIds); // assigns vendor ids to their respective maps

            this.vendors_ = vendorIds.reduce((vendors, vendorId) => {
              const vendor = this.vendors_[String(vendorId)];

              if (vendor && vendor.deletedDate === undefined) {
                vendor.purposes.forEach((purposeId) => {
                  const purpGroup = this.byPurposeVendorMap[String(purposeId)];
                  purpGroup.consent.add(vendorId);
                });
                vendor.specialPurposes.forEach((purposeId) => {
                  this.bySpecialPurposeVendorMap[String(purposeId)].add(
                    vendorId
                  );
                });
                vendor.legIntPurposes.forEach((purposeId) => {
                  this.byPurposeVendorMap[String(purposeId)].legInt.add(
                    vendorId
                  );
                }); // could not be there

                if (vendor.flexiblePurposes) {
                  vendor.flexiblePurposes.forEach((purposeId) => {
                    this.byPurposeVendorMap[String(purposeId)].flexible.add(
                      vendorId
                    );
                  });
                }

                vendor.features.forEach((featureId) => {
                  this.byFeatureVendorMap[String(featureId)].add(vendorId);
                });
                vendor.specialFeatures.forEach((featureId) => {
                  this.bySpecialFeatureVendorMap[String(featureId)].add(
                    vendorId
                  );
                });
                vendors[vendorId] = vendor;
              }

              return vendors;
            }, {});
          }

          mapGoogleVendors(vendorIds) {
            if (!Array.isArray(vendorIds)) {
              vendorIds = Object.keys(this.fullGoogleVendorList).map(
                (vId) => +vId
              );
            }

            this.googleVendors_ = vendorIds.reduce((vendors, vendorId) => {
              const vendor = this.googleVendors_[String(vendorId)];
              if (vendor) vendors[vendorId] = vendor;
              return vendors;
            }, {});
            this.googleVendorIds = new Set(Object.keys(this.googleVendors_));
          }

          getFilteredVendors(purposeOrFeature, id, subType, special) {
            const properPurposeOrFeature =
              purposeOrFeature.charAt(0).toUpperCase() +
              purposeOrFeature.slice(1);
            let vendorSet;
            const retr = {};

            if (purposeOrFeature === "purpose" && subType) {
              vendorSet =
                this["by" + properPurposeOrFeature + "VendorMap"][String(id)][
                  subType
                ];
            } else {
              vendorSet =
                this[
                  "by" +
                    (special ? "Special" : "") +
                    properPurposeOrFeature +
                    "VendorMap"
                ][String(id)];
            }

            vendorSet.forEach((vendorId) => {
              retr[String(vendorId)] = this.vendors[String(vendorId)];
            });
            return retr;
          }
          /**
           * getVendorsWithConsentPurpose
           *
           * @param {number} purposeId
           * @return {IntMap<Vendor>} - list of vendors that have declared the consent purpose id
           */

          getVendorsWithConsentPurpose(purposeId) {
            return this.getFilteredVendors("purpose", purposeId, "consent");
          }
          /**
           * getVendorsWithLegIntPurpose
           *
           * @param {number} purposeId
           * @return {IntMap<Vendor>} - list of vendors that have declared the legInt (Legitimate Interest) purpose id
           */

          getVendorsWithLegIntPurpose(purposeId) {
            return this.getFilteredVendors("purpose", purposeId, "legInt");
          }
          /**
           * getVendorsWithFlexiblePurpose
           *
           * @param {number} purposeId
           * @return {IntMap<Vendor>} - list of vendors that have declared the flexible purpose id
           */

          getVendorsWithFlexiblePurpose(purposeId) {
            return this.getFilteredVendors("purpose", purposeId, "flexible");
          }
          /**
           * getVendorsWithSpecialPurpose
           *
           * @param {number} specialPurposeId
           * @return {IntMap<Vendor>} - list of vendors that have declared the special purpose id
           */

          getVendorsWithSpecialPurpose(specialPurposeId) {
            return this.getFilteredVendors(
              "purpose",
              specialPurposeId,
              undefined,
              true
            );
          }
          /**
           * getVendorsWithFeature
           *
           * @param {number} featureId
           * @return {IntMap<Vendor>} - list of vendors that have declared the feature id
           */

          getVendorsWithFeature(featureId) {
            return this.getFilteredVendors("feature", featureId);
          }
          /**
           * getVendorsWithSpecialFeature
           *
           * @param {number} specialFeatureId
           * @return {IntMap<Vendor>} - list of vendors that have declared the special feature id
           */

          getVendorsWithSpecialFeature(specialFeatureId) {
            return this.getFilteredVendors(
              "feature",
              specialFeatureId,
              undefined,
              true
            );
          }
          /**
           * vendors
           *
           * @return {IntMap<Vendor>} - the list of vendors as it would on the JSON file
           * except if `narrowVendorsTo` was called, it would be that narrowed list
           */

          get vendors() {
            return this.vendors_;
          }
          /**
           * narrowVendorsTo - narrows vendors represented in this GVL to the list of ids passed in
           *
           * @param {number[]} vendorIds - list of ids to narrow this GVL to
           * @return {void}
           */

          narrowVendorsTo(vendorIds) {
            this.mapVendors(vendorIds);
          }
          /**
           * googleVendors
           *
           * @return {IntMap<GoogleVendor>} - the list of google vendors as it would on the JSON file
           * except if `narrowGoogleVendorsTo` was called, it would be that narrowed list
           */

          get googleVendors() {
            return this.googleVendors_;
          }
          /**
           * narrowGoogleVendorsTo - narrows google vendors represented in this GVL to the list of ids passed in
           *
           * @param {number[]} vendorIds - list of ids to narrow this GVL to
           * @return {void}
           */

          narrowGoogleVendorsTo(vendorIds) {
            this.mapGoogleVendors(vendorIds);
          }
          /**
           * isReady - Whether or not this instance is ready to be used.  This will be
           * immediately and synchronously true if a vendorlist object is passed into
           * the constructor or once the JSON vendorllist is retrieved.
           *
           * @return {boolean} whether or not the instance is ready to be interacted
           * with and all the data is populated
           */

          get isReady() {
            return this.isReady_;
          }
          /**
           * clone - overrides base `clone()` method since GVL is a special class that
           * represents a JSON structure with some additional functionality.
           *
           * @return {GVL}
           */

          clone() {
            const result = new GVL(this.getJson());
            /*
             * If the current language of the GVL is not the default language, we set the language of
             * the clone to the current language since a new GVL is always created with the default
             * language. */

            if (this.lang_ !== GVL.DEFAULT_LANGUAGE) {
              /*
               * Since the GVL language was changed, this means that an asynchronous changeLanguage
               * call was made prior to cloning the GVL.  The new language specified has been cached
               * by the GVL and this changeLanguage call made as a part of cloning the GVL will be
               * synchronous. The code will look for the language definitions in the cache instead
               * of creating a http request. */
              result.changeLanguage(this.lang_);
            }

            return result;
          }

          static isInstanceOf(questionableInstance) {
            const isSo = typeof questionableInstance === "object";
            return (
              isSo && typeof questionableInstance.narrowVendorsTo === "function"
            );
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/Json.js":
      /*!******************************!*\
  !*** ./iab-tcf-core/Json.js ***!
  \******************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Json: () => /* binding */ Json,
          /* harmony export */
        });
        class Json {
          static absCall(url, body, sendCookies, timeout) {
            return new Promise((resolve, reject) => {
              const ckyXHR = window.cookieyes._ckyXHR;
              const req = new ckyXHR();

              const onLoad = () => {
                // is the response done
                if (req.readyState == ckyXHR.DONE) {
                  /**
                   * For our purposes if it's not a 200 range response, then it's a
                   * failure.
                   */
                  if (req.status >= 200 && req.status < 300) {
                    let response = req.response;

                    if (typeof response === "string") {
                      try {
                        response = JSON.parse(response);
                      } catch (e) {}
                    }

                    resolve(response);
                  } else {
                    reject(
                      new Error(
                        `HTTP Status: ${req.status} response type: ${req.responseType}`
                      )
                    );
                  }
                }
              };

              const onError = () => {
                reject(new Error("error"));
              };

              const onAbort = () => {
                reject(new Error("aborted"));
              };

              const onTimeout = () => {
                reject(new Error("Timeout " + timeout + "ms " + url));
              };

              req.withCredentials = sendCookies;
              req.addEventListener("load", onLoad);
              req.addEventListener("error", onError);
              req.addEventListener("abort", onAbort);

              if (body === null) {
                req.open("GET", url, true);
              } else {
                req.open("POST", url, true);
              }

              req.responseType = "json"; // IE has a problem if this is before the open

              req.timeout = timeout;
              req.ontimeout = onTimeout;
              req.send(body);
            });
          }
          /**
           * @static
           * @param {string} url - full path to POST to
           * @param {object} body - JSON object to post
           * @param {boolean} sendCookies - Whether or not to send the XMLHttpRequest with credentials or not
           * @param {number} [timeout] - optional timeout in milliseconds
           * @return {Promise<object>} - if the server responds the response will be returned here
           */

          static post(url, body, sendCookies = false, timeout = 0) {
            return this.absCall(
              url,
              JSON.stringify(body),
              sendCookies,
              timeout
            );
          }
          /**
           * @static
           * @param {string} url - full path to the json
           * @param {boolean} sendCookies - Whether or not to send the XMLHttpRequest with credentials or not
           * @param {number} [timeout] - optional timeout in milliseconds
           * @return {Promise<object>} - resolves with parsed JSON
           */

          static fetch(url, sendCookies = false, timeout = 0) {
            return this.absCall(url, null, sendCookies, timeout);
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/TCModel.js":
      /*!*********************************!*\
  !*** ./iab-tcf-core/TCModel.js ***!
  \*********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ TCModel: () => /* binding */ TCModel,
          /* harmony export */
        });
        /* harmony import */ var _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./Cloneable.js */ "./iab-tcf-core/Cloneable.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _GVL_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./GVL.js */ "./iab-tcf-core/GVL.js");
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class TCModel extends _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__.Cloneable {
          /**
           * Set of available consent languages published by the IAB
           */
          static consentLanguages =
            _GVL_js__WEBPACK_IMPORTED_MODULE_2__.GVL.consentLanguages;
          isServiceSpecific_ = false;
          supportOOB_ = true;
          useNonStandardTexts_ = false;
          purposeOneTreatment_ = false;
          publisherCountryCode_ = "AA";
          version_ = 2;
          consentScreen_ = 0;
          policyVersion_ = 4;
          consentLanguage_ = "EN";
          cmpId_ = 0;
          cmpVersion_ = 0;
          vendorListVersion_ = 0;
          numCustomPurposes_ = 0; // Member Variable for GVL

          gvl_;
          created;
          lastUpdated;
          /**
           * The TCF designates certain Features as special, that is, a CMP must afford
           * the user a means to opt in to their use. These Special Features are
           * published and numbered in the GVL separately from normal Features.
           * Provides for up to 12 special features.
           */

          specialFeatureOptins =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * Renamed from `PurposesAllowed` in TCF v1.1
           * The user’s consent value for each Purpose established on the legal basis
           * of consent. Purposes are published in the Global Vendor List (see. [[GVL]]).
           */

          purposeConsents =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * The user’s permission for each Purpose established on the legal basis of
           * legitimate interest. If the user has exercised right-to-object for a
           * purpose.
           */

          purposeLegitimateInterests =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * The user’s consent value for each Purpose established on the legal basis
           * of consent, for the publisher.  Purposes are published in the Global
           * Vendor List.
           */

          publisherConsents =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * The user’s permission for each Purpose established on the legal basis of
           * legitimate interest.  If the user has exercised right-to-object for a
           * purpose.
           */

          publisherLegitimateInterests =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * The user’s consent value for each Purpose established on the legal basis
           * of consent, for the publisher.  Purposes are published in the Global
           * Vendor List.
           */

          publisherCustomConsents =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * The user’s permission for each Purpose established on the legal basis of
           * legitimate interest.  If the user has exercised right-to-object for a
           * purpose that is established in the publisher's custom purposes.
           */

          publisherCustomLegitimateInterests =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * set by a publisher if they wish to collect consent and LI Transparency for
           * purposes outside of the TCF
           */

          customPurposes;
          /**
           * Each [[Vendor]] is keyed by id. Their consent value is true if it is in
           * the Vector
           */

          vendorConsents =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * Each [[Vendor]] is keyed by id. Whether their Legitimate Interests
           * Disclosures have been established is stored as boolean.
           * see: [[Vector]]
           */

          vendorLegitimateInterests =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * The value included for disclosed vendors signals which vendors have been
           * disclosed to the user in the interface surfaced by the CMP. This section
           * content is required when writing a TC string to the global (consensu)
           * scope. When a CMP has read from and is updating a TC string from the
           * global consensu.org storage, the CMP MUST retain the existing disclosure
           * information and only add information for vendors that it has disclosed
           * that had not been disclosed by other CMPs in prior interactions with this
           * device/user agent.
           */

          vendorsDisclosed =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          /**
           * Signals which vendors the publisher permits to use OOB legal bases.
           */

          vendorsAllowed =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.Vector();
          publisherRestrictions =
            new _model_index_js__WEBPACK_IMPORTED_MODULE_3__.PurposeRestrictionVector();
          /**
           * Constructs the TCModel. Passing a [[GVL]] is optional when constructing
           * as this TCModel may be constructed from decoding an existing encoded
           * TCString.
           *
           * @param {GVL} [gvl]
           */

          constructor(gvl) {
            super();

            if (gvl) {
              this.gvl = gvl;
            }

            this.updated();
          }
          /**
           * sets the [[GVL]] with side effects of also setting the `vendorListVersion`, `policyVersion`, and `consentLanguage`
           * @param {GVL} gvl
           */

          set gvl(gvl) {
            /**
             * set the reference, but make sure it's our GVL wrapper class.
             */
            if (!_GVL_js__WEBPACK_IMPORTED_MODULE_2__.GVL.isInstanceOf(gvl)) {
              gvl = new _GVL_js__WEBPACK_IMPORTED_MODULE_2__.GVL(gvl);
            }

            this.gvl_ = gvl;
            this.publisherRestrictions.gvl = gvl;
          }
          /**
           * @return {GVL} the gvl instance set on this TCModel instance
           */

          get gvl() {
            return this.gvl_;
          }
          /**
           * @param {number} integer - A unique ID will be assigned to each Consent
           * Manager Provider (CMP) from the iab.
           *
           * @throws {TCModelError} if the value is not an integer greater than 1 as those are not valid.
           */

          set cmpId(integer) {
            integer = Number(integer);

            if (Number.isInteger(integer) && integer > 1) {
              this.cmpId_ = integer;
            } else {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "cmpId",
                integer
              );
            }
          }

          get cmpId() {
            return this.cmpId_;
          }
          /**
           * Each change to an operating CMP should receive a
           * new version number, for logging proof of consent. CmpVersion defined by
           * each CMP.
           *
           * @param {number} integer
           *
           * @throws {TCModelError} if the value is not an integer greater than 1 as those are not valid.
           */

          set cmpVersion(integer) {
            integer = Number(integer);

            if (Number.isInteger(integer) && integer > -1) {
              this.cmpVersion_ = integer;
            } else {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "cmpVersion",
                integer
              );
            }
          }

          get cmpVersion() {
            return this.cmpVersion_;
          }
          /**
           * The screen number is CMP and CmpVersion
           * specific, and is for logging proof of consent.(For example, a CMP could
           * keep records so that a publisher can request information about the context
           * in which consent was gathered.)
           *
           * @param {number} integer
           *
           * @throws {TCModelError} if the value is not an integer greater than 0 as those are not valid.
           */

          set consentScreen(integer) {
            integer = Number(integer);

            if (Number.isInteger(integer) && integer > -1) {
              this.consentScreen_ = integer;
            } else {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "consentScreen",
                integer
              );
            }
          }

          get consentScreen() {
            return this.consentScreen_;
          }
          /**
           * @param {string} lang - [two-letter ISO 639-1 language
           * code](http://www.loc.gov/standards/iso639-2/php/code_list.php) in which
           * the CMP UI was presented
           *
           * @throws {TCModelError} if the value is not a length-2 string of alpha characters
           */

          set consentLanguage(lang) {
            this.consentLanguage_ = lang;
          }

          get consentLanguage() {
            return this.consentLanguage_;
          }
          /**
           * @param {string} countryCode - [two-letter ISO 3166-1 alpha-2 country
           * code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of the publisher,
           * determined by the CMP-settings of the publisher.
           *
           * @throws {TCModelError} if the value is not a length-2 string of alpha characters
           */

          set publisherCountryCode(countryCode) {
            if (/^([A-z]){2}$/.test(countryCode)) {
              this.publisherCountryCode_ = countryCode.toUpperCase();
            } else {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "publisherCountryCode",
                countryCode
              );
            }
          }

          get publisherCountryCode() {
            return this.publisherCountryCode_;
          }
          /**
           * Version of the GVL used to create this TCModel. Global
           * Vendor List versions will be released periodically.
           *
           * @param {number} integer
           *
           * @throws {TCModelError} if the value is not an integer greater than 0 as those are not valid.
           */

          set vendorListVersion(integer) {
            /**
             * first coerce to a number via leading '+' then take the integer value by
             * bitshifting to the right.  This works on all types in JavaScript and if
             * it's not valid then value will be 0.
             */
            integer = Number(integer) >> 0;

            if (integer < 0) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "vendorListVersion",
                integer
              );
            } else {
              this.vendorListVersion_ = integer;
            }
          }

          get vendorListVersion() {
            if (this.gvl) {
              return this.gvl.vendorListVersion;
            } else {
              return this.vendorListVersion_;
            }
          }
          /**
           * From the corresponding field in the GVL that was
           * used for obtaining consent. A new policy version invalidates existing
           * strings and requires CMPs to re-establish transparency and consent from
           * users.
           *
           * If a TCF policy version number is different from the one from the latest
           * GVL, the CMP must re-establish transparency and consent.
           *
           * @param {number} num - You do not need to set this.  This comes
           * directly from the [[GVL]].
           *
           */

          set policyVersion(num) {
            this.policyVersion_ = parseInt(num, 10);

            if (this.policyVersion_ < 0) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "policyVersion",
                num
              );
            }
          }

          get policyVersion() {
            if (this.gvl) {
              return this.gvl.tcfPolicyVersion;
            } else {
              return this.policyVersion_;
            }
          }

          set version(num) {
            this.version_ = parseInt(num, 10);
          }

          get version() {
            return this.version_;
          }
          /**
           * Whether the signals encoded in this TC String were from site-specific
           * storage `true` versus ‘global’ consensu.org shared storage `false`. A
           * string intended to be stored in global/shared scope but the CMP is unable
           * to store due to a user agent not accepting third-party cookies would be
           * considered site-specific `true`.
           *
           * @param {boolean} bool - value to set. Some changes to other fields in this
           * model will automatically change this value like adding publisher
           * restrictions.
           */

          set isServiceSpecific(bool) {
            this.isServiceSpecific_ = bool;
          }

          get isServiceSpecific() {
            return this.isServiceSpecific_;
          }
          /**
           * Non-standard stacks means that a CMP is using publisher-customized stack
           * descriptions. Stacks (in terms of purposes in a stack) are pre-set by the
           * IAB. As are titles. Descriptions are pre-set, but publishers can customize
           * them. If they do, they need to set this bit to indicate that they've
           * customized descriptions.
           *
           * @param {boolean} bool - value to set
           */

          set useNonStandardTexts(bool) {
            this.useNonStandardTexts_ = bool;
          }

          get useNonStandardTexts() {
            return this.useNonStandardTexts_;
          }
          /**
           * Whether or not this publisher supports OOB signaling.  On Global TC String
           * OOB Vendors Disclosed will be included if the publish wishes to no allow
           * these vendors they should set this to false.
           * @param {boolean} bool - value to set
           */

          set supportOOB(bool) {
            this.supportOOB_ = bool;
          }

          get supportOOB() {
            return this.supportOOB_;
          }
          /**
           * `false` There is no special Purpose 1 status.
           * Purpose 1 was disclosed normally (consent) as expected by Policy.  `true`
           * Purpose 1 not disclosed at all. CMPs use PublisherCC to indicate the
           * publisher’s country of establishment to help Vendors determine whether the
           * vendor requires Purpose 1 consent. In global scope TC strings, this field
           * must always have a value of `false`. When a CMP encounters a global scope
           * string with `purposeOneTreatment=true` then that string should be
           * considered invalid and the CMP must re-establish transparency and consent.
           *
           * @param {boolean} bool
           */

          set purposeOneTreatment(bool) {
            this.purposeOneTreatment_ = bool;
          }

          get purposeOneTreatment() {
            return this.purposeOneTreatment_;
          }
          /**
           * setAllVendorConsents - sets all vendors on the GVL Consent (true)
           *
           * @return {void}
           */

          setAllVendorConsents() {
            this.vendorConsents.set(this.gvl.vendors);
          }
          /**
           * unsetAllVendorConsents - unsets all vendors on the GVL Consent (false)
           *
           * @return {void}
           */

          unsetAllVendorConsents() {
            this.vendorConsents.empty();
          }
          /**
           * setAllVendorsDisclosed - sets all vendors on the GVL Vendors Disclosed (true)
           *
           * @return {void}
           */

          setAllVendorsDisclosed() {
            this.vendorsDisclosed.set(this.gvl.vendors);
          }
          /**
           * unsetAllVendorsDisclosed - unsets all vendors on the GVL Consent (false)
           *
           * @return {void}
           */

          unsetAllVendorsDisclosed() {
            this.vendorsDisclosed.empty();
          }
          /**
           * setAllVendorsAllowed - sets all vendors on the GVL Consent (true)
           *
           * @return {void}
           */

          setAllVendorsAllowed() {
            this.vendorsAllowed.set(this.gvl.vendors);
          }
          /**
           * unsetAllVendorsAllowed - unsets all vendors on the GVL Consent (false)
           *
           * @return {void}
           */

          unsetAllVendorsAllowed() {
            this.vendorsAllowed.empty();
          }
          /**
           * setAllVendorLegitimateInterests - sets all vendors on the GVL LegitimateInterests (true)
           *
           * @return {void}
           */

          setAllVendorLegitimateInterests() {
            this.vendorLegitimateInterests.set(this.gvl.vendors);
          }
          /**
           * unsetAllVendorLegitimateInterests - unsets all vendors on the GVL LegitimateInterests (false)
           *
           * @return {void}
           */

          unsetAllVendorLegitimateInterests() {
            this.vendorLegitimateInterests.empty();
          }
          /**
           * setAllPurposeConsents - sets all purposes on the GVL Consent (true)
           *
           * @return {void}
           */

          setAllPurposeConsents() {
            this.purposeConsents.set(this.gvl.purposes);
          }
          /**
           * unsetAllPurposeConsents - unsets all purposes on the GVL Consent (false)
           *
           * @return {void}
           */

          unsetAllPurposeConsents() {
            this.purposeConsents.empty();
          }
          /**
           * setAllPurposeLegitimateInterests - sets all purposes on the GVL LI Transparency (true)
           *
           * @return {void}
           */

          setAllPurposeLegitimateInterests() {
            this.purposeLegitimateInterests.set(this.gvl.purposes);
          }
          /**
           * unsetAllPurposeLegitimateInterests - unsets all purposes on the GVL LI Transparency (false)
           *
           * @return {void}
           */

          unsetAllPurposeLegitimateInterests() {
            this.purposeLegitimateInterests.empty();
          }
          /**
           * setAllSpecialFeatureOptins - sets all special featuresOptins on the GVL (true)
           *
           * @return {void}
           */

          setAllSpecialFeatureOptins() {
            this.specialFeatureOptins.set(this.gvl.specialFeatures);
          }
          /**
           * unsetAllSpecialFeatureOptins - unsets all special featuresOptins on the GVL (true)
           *
           * @return {void}
           */

          unsetAllSpecialFeatureOptins() {
            this.specialFeatureOptins.empty();
          }

          setAll() {
            this.setAllVendorConsents();
            this.setAllPurposeLegitimateInterests();
            this.setAllSpecialFeatureOptins();
            this.setAllPurposeConsents();
            this.setAllVendorLegitimateInterests();
          }

          unsetAll() {
            this.unsetAllVendorConsents();
            this.unsetAllPurposeLegitimateInterests();
            this.unsetAllSpecialFeatureOptins();
            this.unsetAllPurposeConsents();
            this.unsetAllVendorLegitimateInterests();
          }

          get numCustomPurposes() {
            let len = this.numCustomPurposes_;

            if (typeof this.customPurposes === "object") {
              /**
               * Keys are not guaranteed to be in order and likewise there is no
               * requirement that the customPurposes be non-sparse.  So we have to sort
               * and take the highest value.  Even if the set only contains 3 purposes
               * but goes to ID 6 we need to set the number to 6 for the encoding to
               * work properly since it's positional.
               */
              const purposeIds = Object.keys(this.customPurposes).sort(
                (a, b) => Number(a) - Number(b)
              );
              len = parseInt(purposeIds.pop(), 10);
            }

            return len;
          }

          set numCustomPurposes(num) {
            this.numCustomPurposes_ = parseInt(num, 10);

            if (this.numCustomPurposes_ < 0) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "numCustomPurposes",
                num
              );
            }
          }
          /**
           * updated - updates the created and lastUpdated dates with a 'now' day-level UTC timestamp
           *
           * @return {void}
           */

          updated() {
            const date = new Date();
            const utcDate = new Date(
              Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
              )
            );
            this.created = utcDate;
            this.lastUpdated = utcDate;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/TCString.js":
      /*!**********************************!*\
  !*** ./iab-tcf-core/TCString.js ***!
  \**********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ TCString: () => /* binding */ TCString,
          /* harmony export */
        });
        /* harmony import */ var _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./encoder/index.js */ "./iab-tcf-core/encoder/index.js"
          );
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./model/index.js */ "./iab-tcf-core/model/index.js"
          );
        /* harmony import */ var _encoder_field_IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./encoder/field/IntEncoder.js */ "./iab-tcf-core/encoder/field/IntEncoder.js"
          );
        /* harmony import */ var _TCModel_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(/*! ./TCModel.js */ "./iab-tcf-core/TCModel.js");

        /**
         * Main class for encoding and decoding a
         * TCF Transparency and Consent String
         */

        class TCString {
          /**
           * encodes a model into a TCString
           *
           * @param {TCModel} tcModel - model to convert into encoded string
           * @param {EncodingOptions} options - for encoding options other than default
           * @return {string} - base64url encoded Transparency and Consent String
           */
          static encode(tcModel, options) {
            let out = "";
            let sequence;
            tcModel =
              _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.SemanticPreEncoder.process(
                tcModel,
                options
              );
            /**
             * If they pass in a special segment sequence.
             */

            if (Array.isArray(options?.segments)) {
              sequence = options.segments;
            } else {
              sequence =
                new _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.SegmentSequence(
                  tcModel,
                  options
                )["" + tcModel.version];
            }

            sequence.forEach((segment, idx) => {
              let dotMaybe = "";

              if (idx < sequence.length - 1) {
                dotMaybe = ".";
              }

              out +=
                _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.SegmentEncoder.encode(
                  tcModel,
                  segment
                ) + dotMaybe;
            });
            return out;
          }
          /**
           * Decodes a string into a TCModel
           *
           * @param {string} encodedTCString - base64url encoded Transparency and
           * Consent String to decode - can also be a single or group of segments of
           * the string
           * @param {string} [tcModel] - model to enhance with the information.  If
           * none is passed a new instance of TCModel will be created.
           * @return {TCModel} - Returns populated TCModel
           */

          static decode(encodedTCString, tcModel) {
            const segments = encodedTCString.split(".");
            const len = segments.length;

            if (!tcModel) {
              tcModel = new _TCModel_js__WEBPACK_IMPORTED_MODULE_3__.TCModel();
            }

            for (let i = 0; i < len; i++) {
              const segString = segments[i];
              /**
               * first char will contain 6 bits, we only need the first 3. In version 1
               * and 2 of the TC string there is no segment type for the CORE string.
               * Instead the first 6 bits are reserved for the encoding version, but
               * because we're only on a maximum of encoding version 2 the first 3 bits
               * in the core segment will evaluate to 0.
               */

              const firstChar =
                _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.Base64Url.decode(
                  segString.charAt(0)
                );
              const segTypeBits = firstChar.substr(
                0,
                _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                  .segmentType
              );
              const segment =
                _model_index_js__WEBPACK_IMPORTED_MODULE_1__.SegmentIDs
                  .ID_TO_KEY[
                  _encoder_field_IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.decode(
                    segTypeBits,
                    _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .segmentType
                  ).toString()
                ];
              _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.SegmentEncoder.decode(
                segString,
                tcModel,
                segment
              );
            }

            return tcModel;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/Base64Url.js":
      /*!*******************************************!*\
  !*** ./iab-tcf-core/encoder/Base64Url.js ***!
  \*******************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Base64Url: () => /* binding */ Base64Url,
          /* harmony export */
        });
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );

        class Base64Url {
          /**
           * Base 64 URL character set.  Different from standard Base64 char set
           * in that '+' and '/' are replaced with '-' and '_'.
           */
          static DICT =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
          static REVERSE_DICT = new Map([
            ["A", 0],
            ["B", 1],
            ["C", 2],
            ["D", 3],
            ["E", 4],
            ["F", 5],
            ["G", 6],
            ["H", 7],
            ["I", 8],
            ["J", 9],
            ["K", 10],
            ["L", 11],
            ["M", 12],
            ["N", 13],
            ["O", 14],
            ["P", 15],
            ["Q", 16],
            ["R", 17],
            ["S", 18],
            ["T", 19],
            ["U", 20],
            ["V", 21],
            ["W", 22],
            ["X", 23],
            ["Y", 24],
            ["Z", 25],
            ["a", 26],
            ["b", 27],
            ["c", 28],
            ["d", 29],
            ["e", 30],
            ["f", 31],
            ["g", 32],
            ["h", 33],
            ["i", 34],
            ["j", 35],
            ["k", 36],
            ["l", 37],
            ["m", 38],
            ["n", 39],
            ["o", 40],
            ["p", 41],
            ["q", 42],
            ["r", 43],
            ["s", 44],
            ["t", 45],
            ["u", 46],
            ["v", 47],
            ["w", 48],
            ["x", 49],
            ["y", 50],
            ["z", 51],
            ["0", 52],
            ["1", 53],
            ["2", 54],
            ["3", 55],
            ["4", 56],
            ["5", 57],
            ["6", 58],
            ["7", 59],
            ["8", 60],
            ["9", 61],
            ["-", 62],
            ["_", 63],
          ]);
          /**
           * log2(64) = 6
           */

          static BASIS = 6;
          static LCM = 24;
          /**
           * encodes an arbitrary-length bitfield string into base64url
           *
           * @static
           * @param {string} str - arbitrary-length bitfield string to be encoded to base64url
           * @return {string} - base64url encoded result
           */

          static encode(str) {
            /**
             * should only be 0 or 1
             */
            if (!/^[0-1]+$/.test(str)) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_0__.EncodingError(
                "Invalid bitField"
              );
            }
            /**
             * Pad the end of the string to the least common mutliple of 6 (basis for
             * base64) and 8 (one byte)
             */

            const padding = str.length % this.LCM;
            str += padding ? "0".repeat(this.LCM - padding) : "";
            let result = "";

            for (let i = 0; i < str.length; i += this.BASIS) {
              result += this.DICT[parseInt(str.substr(i, this.BASIS), 2)];
            }

            return result;
          }
          /**
           * decodes a base64url encoded bitfield string
           *
           * @static
           * @param {string} str - base64url encoded bitfield string to be decoded
           * @return {string} - bitfield string
           */

          static decode(str) {
            /**
             * should contain only characters from the base64url set
             */
            if (!/^[A-Za-z0-9\-_]+$/.test(str)) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_0__.DecodingError(
                "Invalidly encoded Base64URL string"
              );
            }

            let result = "";

            for (let i = 0; i < str.length; i++) {
              /**
               * index the binary value of the character from out reverse map
               */
              const strBits = this.REVERSE_DICT.get(str[i]).toString(2);
              /**
               * Since a bit string converted to an integer on encoding will lose
               * leading zeros – pad to the left for those missing leading zeros
               */

              result += "0".repeat(this.BASIS - strBits.length) + strBits;
            }

            return result;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/BitLength.js":
      /*!*******************************************!*\
  !*** ./iab-tcf-core/encoder/BitLength.js ***!
  \*******************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ BitLength: () => /* binding */ BitLength,
          /* harmony export */
        });
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class BitLength {
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .cmpId] = 12;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .cmpVersion] = 12;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .consentLanguage] = 12;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .consentScreen] = 6;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .created] = 36;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .isServiceSpecific] = 1;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .lastUpdated] = 36;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .policyVersion] = 6;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .publisherCountryCode] = 12;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .publisherLegitimateInterests] = 24;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .publisherConsents] = 24;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .purposeConsents] = 24;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .purposeLegitimateInterests] = 24;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .purposeOneTreatment] = 1;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .specialFeatureOptins] = 12;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .useNonStandardTexts] = 1;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .vendorListVersion] = 12;
          static [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
            .version] = 6;
          static anyBoolean = 1;
          static encodingType = 1;
          static maxId = 16;
          static numCustomPurposes = 6;
          static numEntries = 12;
          static numRestrictions = 12;
          static purposeId = 6;
          static restrictionType = 2;
          static segmentType = 3;
          static singleOrRange = 1;
          static vendorId = 16;
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/EncodingOptions.js":
      /*!*************************************************!*\
  !*** ./iab-tcf-core/encoder/EncodingOptions.js ***!
  \*************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/encoder/SegmentEncoder.js":
      /*!************************************************!*\
  !*** ./iab-tcf-core/encoder/SegmentEncoder.js ***!
  \************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ SegmentEncoder: () =>
            /* binding */ SegmentEncoder,
          /* harmony export */
        });
        /* harmony import */ var _Base64Url_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./Base64Url.js */ "./iab-tcf-core/encoder/Base64Url.js"
          );
        /* harmony import */ var _BitLength_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./BitLength.js */ "./iab-tcf-core/encoder/BitLength.js"
          );
        /* harmony import */ var _field_index_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./field/index.js */ "./iab-tcf-core/encoder/field/index.js"
          );
        /* harmony import */ var _sequence_index_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./sequence/index.js */ "./iab-tcf-core/encoder/sequence/index.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _model_Fields_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ../model/Fields.js */ "./iab-tcf-core/model/Fields.js"
          );
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ../model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class SegmentEncoder {
          static fieldSequence =
            new _sequence_index_js__WEBPACK_IMPORTED_MODULE_3__.FieldSequence();

          static encode(tcModel, segment) {
            let sequence;

            try {
              sequence = this.fieldSequence[String(tcModel.version)][segment];
            } catch (err) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_4__.EncodingError(
                `Unable to encode version: ${tcModel.version}, segment: ${segment}`
              );
            }

            let bitField = "";
            /**
             * If this is anything other than the core segment we have a "segment id"
             * to append to the front of the string
             */

            if (
              segment !==
              _model_index_js__WEBPACK_IMPORTED_MODULE_6__.Segment.CORE
            ) {
              bitField =
                _field_index_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.encode(
                  _model_index_js__WEBPACK_IMPORTED_MODULE_6__.SegmentIDs
                    .KEY_TO_ID[segment],
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_1__.BitLength
                    .segmentType
                );
            }

            const fieldEncoderMap = (0,
            _field_index_js__WEBPACK_IMPORTED_MODULE_2__.FieldEncoderMap)();
            sequence.forEach((key) => {
              const value = tcModel[key];
              const encoder = fieldEncoderMap[key];
              let numBits =
                _BitLength_js__WEBPACK_IMPORTED_MODULE_1__.BitLength[key];

              if (numBits === undefined) {
                if (this.isPublisherCustom(key)) {
                  /**
                   * publisherCustom[Consents | LegitimateInterests] are an edge case
                   * because they are of variable length. The length is defined in a
                   * separate field named numCustomPurposes.
                   */
                  numBits = Number(
                    tcModel[
                      _model_Fields_js__WEBPACK_IMPORTED_MODULE_5__.Fields
                        .numCustomPurposes
                    ]
                  );
                }
              }

              try {
                bitField += encoder.encode(value, numBits);
              } catch (err) {
                throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_4__.EncodingError(
                  `Error encoding ${segment}->${key}: ${err.message}`
                );
              }
            }); // base64url encode the string and return

            return _Base64Url_js__WEBPACK_IMPORTED_MODULE_0__.Base64Url.encode(
              bitField
            );
          }

          static decode(encodedString, tcModel, segment) {
            const bitField =
              _Base64Url_js__WEBPACK_IMPORTED_MODULE_0__.Base64Url.decode(
                encodedString
              );
            let bStringIdx = 0;

            if (
              segment ===
              _model_index_js__WEBPACK_IMPORTED_MODULE_6__.Segment.CORE
            ) {
              tcModel.version =
                _field_index_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.decode(
                  bitField.substr(
                    bStringIdx,
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_1__.BitLength[
                      _model_Fields_js__WEBPACK_IMPORTED_MODULE_5__.Fields
                        .version
                    ]
                  ),
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_1__.BitLength[
                    _model_Fields_js__WEBPACK_IMPORTED_MODULE_5__.Fields.version
                  ]
                );
            }

            if (
              segment !==
              _model_index_js__WEBPACK_IMPORTED_MODULE_6__.Segment.CORE
            ) {
              bStringIdx +=
                _BitLength_js__WEBPACK_IMPORTED_MODULE_1__.BitLength
                  .segmentType;
            }

            const sequence =
              this.fieldSequence[String(tcModel.version)][segment];
            const fieldEncoderMap = (0,
            _field_index_js__WEBPACK_IMPORTED_MODULE_2__.FieldEncoderMap)();
            sequence.forEach((key) => {
              const encoder = fieldEncoderMap[key];
              let numBits =
                _BitLength_js__WEBPACK_IMPORTED_MODULE_1__.BitLength[key];

              if (numBits === undefined) {
                if (this.isPublisherCustom(key)) {
                  /**
                   * publisherCustom[Consents | LegitimateInterests] are an edge case
                   * because they are of variable length. The length is defined in a
                   * separate field named numCustomPurposes.
                   */
                  numBits = Number(
                    tcModel[
                      _model_Fields_js__WEBPACK_IMPORTED_MODULE_5__.Fields
                        .numCustomPurposes
                    ]
                  );
                }
              }

              if (numBits !== 0) {
                /**
                 * numBits could be 0 if this is a publisher custom purposes field and
                 * no custom purposes are defined. If that is the case, we don't need
                 * to gather no bits and we don't need to increment our bStringIdx
                 * pointer because those would all be 0 increments and would mess up
                 * the next logical if statement.
                 */
                const bits = bitField.substr(bStringIdx, numBits);

                if (
                  encoder ===
                  _field_index_js__WEBPACK_IMPORTED_MODULE_2__.VendorVectorEncoder
                ) {
                  tcModel[key] = encoder.decode(bits, tcModel.version);
                } else {
                  tcModel[key] = encoder.decode(bits, numBits);
                }

                if (Number.isInteger(numBits)) {
                  bStringIdx += numBits;
                } else if (Number.isInteger(tcModel[key].bitLength)) {
                  bStringIdx += tcModel[key].bitLength;
                } else {
                  throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_4__.DecodingError(
                    key
                  );
                }
              }
            });
            return tcModel;
          }

          static isPublisherCustom(key) {
            return key.indexOf("publisherCustom") === 0;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/SemanticPreEncoder.js":
      /*!****************************************************!*\
  !*** ./iab-tcf-core/encoder/SemanticPreEncoder.js ***!
  \****************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ SemanticPreEncoder: () =>
            /* binding */ SemanticPreEncoder,
          /* harmony export */
        });
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class SemanticPreEncoder {
          static processor = [
            (tcModel) => tcModel,
            (tcModel, gvl) => {
              /**
               * in case this wasn't set previously.  This should filter out invalid
               * purpose restrictions.
               */
              tcModel.publisherRestrictions.gvl = gvl;
              /**
               * Purpose 1 is never allowed to be true for legitimate interest
               * As of TCF v2.2 purposes 3,4,5 & 6 are not allowed to be true for LI
               */

              tcModel.purposeLegitimateInterests.unset([1, 3, 4, 5, 6]);
              /**
               * If a Vendor does not declare a purpose for consent or legitimate
               * interest they should not have a positive signal for it. This code
               * removes positive signals created mistakingly.
               */

              const vectorToIntMap = new Map();
              vectorToIntMap.set(
                "legIntPurposes",
                tcModel.vendorLegitimateInterests
              );
              vectorToIntMap.set("purposes", tcModel.vendorConsents);
              vectorToIntMap.forEach((vector, gvlVendorKey) => {
                vector.forEach((value, vendorId) => {
                  if (value) {
                    const vendor = gvl.vendors[vendorId];

                    if (!vendor || vendor.deletedDate) {
                      /**
                       * If the vendor doesn't exist, then they should not receive a
                       * positive signal
                       */
                      vector.unset(vendorId);
                    } else if (vendor[gvlVendorKey].length === 0) {
                      if (
                        gvlVendorKey === "legIntPurposes" &&
                        vendor["purposes"].length === 0 &&
                        vendor["legIntPurposes"].length === 0 &&
                        vendor["specialPurposes"].length > 0
                      ) {
                        /**
                         * Per June 2021 Policy change, Vendors declaring only Special Purposes must
                         * have their legitimate interest Vendor bit set if they have been disclosed.
                         * This empty block ensures their LI bit remains set
                         */
                      } else {
                        /**
                         * If the vendor does exist, but they haven't declared any
                         * purposes for this legal basis, then we need to see if they can
                         * possibly have the legal basis from their flexible purposes.
                         */
                        if (tcModel.isServiceSpecific) {
                          if (vendor.flexiblePurposes.length === 0) {
                            /**
                             * No flexible basis for any purposes, so we can safely remove
                             * this vendor from the legal basis.
                             */
                            vector.unset(vendorId);
                          } else {
                            /**
                             * They have some flexible purposes, we should check for a
                             * publisher restriction value that would enable this vendor to
                             * have the override-preferred basis.
                             */
                            const restrictions =
                              tcModel.publisherRestrictions.getRestrictions(
                                vendorId
                              );
                            let isValid = false;

                            for (
                              let i = 0, len = restrictions.length;
                              i < len && !isValid;
                              i++
                            ) {
                              /**
                               * If this condition is true the loop will break.  If we are
                               * dealing with the consent purposes ('purposes') and the
                               * publisher restriction overrides to consent then it is
                               * valid for the vendor to have a positive signal for
                               * consent.  Likewise for legitimate interest purposes
                               * ('legIntPurposes') and requiring legitimate interest.
                               */
                              isValid =
                                (restrictions[i].restrictionType ===
                                  _model_index_js__WEBPACK_IMPORTED_MODULE_1__
                                    .RestrictionType.REQUIRE_CONSENT &&
                                  gvlVendorKey === "purposes") ||
                                (restrictions[i].restrictionType ===
                                  _model_index_js__WEBPACK_IMPORTED_MODULE_1__
                                    .RestrictionType.REQUIRE_LI &&
                                  gvlVendorKey === "legIntPurposes");
                            }

                            if (!isValid) {
                              /**
                               * if we came through the previous  loop without finding a
                               * valid reasing: no overriding restrictions (changes in
                               * legal basis) then it's not valid for this vendor to have
                               * this legal basis.
                               */
                              vector.unset(vendorId);
                            }
                          }
                        } else {
                          /**
                           * This is a globally-scoped string so flexible purposes will not
                           * be able to change this value because purposeRestrictions only
                           * apply to service-specific strings.
                           */
                          vector.unset(vendorId);
                        }
                      }
                    }
                  }
                });
              });
              tcModel.vendorsDisclosed.set(gvl.vendors);
              return tcModel;
            },
          ];

          static process(tcModel, options) {
            const gvl = tcModel.gvl;

            if (!gvl) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_0__.EncodingError(
                "Unable to encode TCModel without a GVL"
              );
            }

            if (!gvl.isReady) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_0__.EncodingError(
                "Unable to encode TCModel tcModel.gvl.readyPromise is not resolved"
              );
            }

            tcModel = tcModel.clone();
            tcModel.consentLanguage = gvl.language.slice(0, 2).toUpperCase();

            if (
              options?.version > 0 &&
              options?.version <= this.processor.length
            ) {
              tcModel.version = options.version;
            } else {
              /**
               * this is equal to the latest or most current version
               */
              tcModel.version = this.processor.length;
            }

            const processorFunctionIndex = tcModel.version - 1;

            if (!this.processor[processorFunctionIndex]) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_0__.EncodingError(
                `Invalid version: ${tcModel.version}`
              );
            }

            return this.processor[processorFunctionIndex](tcModel, gvl);
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/BooleanEncoder.js":
      /*!******************************************************!*\
  !*** ./iab-tcf-core/encoder/field/BooleanEncoder.js ***!
  \******************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ BooleanEncoder: () =>
            /* binding */ BooleanEncoder,
          /* harmony export */
        });
        class BooleanEncoder {
          static encode(value) {
            return String(Number(value));
          }

          static decode(value) {
            // less operations than !!parseInt(value, 2)
            return value === "1";
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/DateEncoder.js":
      /*!***************************************************!*\
  !*** ./iab-tcf-core/encoder/field/DateEncoder.js ***!
  \***************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ DateEncoder: () => /* binding */ DateEncoder,
          /* harmony export */
        });
        /* harmony import */ var _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./IntEncoder.js */ "./iab-tcf-core/encoder/field/IntEncoder.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );

        class DateEncoder {
          static encode(value, numBits) {
            return _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__.IntEncoder.encode(
              Math.round(value.getTime() / 100),
              numBits
            );
          }

          static decode(value, numBits) {
            if (numBits !== value.length) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.DecodingError(
                "invalid bit length"
              );
            }

            const date = new Date();
            date.setTime(
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__.IntEncoder.decode(
                value,
                numBits
              ) * 100
            );
            return date;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/FieldEncoderMap.js":
      /*!*******************************************************!*\
  !*** ./iab-tcf-core/encoder/field/FieldEncoderMap.js ***!
  \*******************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ FieldEncoderMap: () =>
            /* binding */ FieldEncoderMap,
          /* harmony export */
        });
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../model/index.js */ "./iab-tcf-core/model/index.js"
          );
        /* harmony import */ var _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./BooleanEncoder.js */ "./iab-tcf-core/encoder/field/BooleanEncoder.js"
          );
        /* harmony import */ var _DateEncoder_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./DateEncoder.js */ "./iab-tcf-core/encoder/field/DateEncoder.js"
          );
        /* harmony import */ var _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./FixedVectorEncoder.js */ "./iab-tcf-core/encoder/field/FixedVectorEncoder.js"
          );
        /* harmony import */ var _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./IntEncoder.js */ "./iab-tcf-core/encoder/field/IntEncoder.js"
          );
        /* harmony import */ var _LangEncoder_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./LangEncoder.js */ "./iab-tcf-core/encoder/field/LangEncoder.js"
          );
        /* harmony import */ var _PurposeRestrictionVectorEncoder_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./PurposeRestrictionVectorEncoder.js */ "./iab-tcf-core/encoder/field/PurposeRestrictionVectorEncoder.js"
          );
        /* harmony import */ var _VendorVectorEncoder_js__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ./VendorVectorEncoder.js */ "./iab-tcf-core/encoder/field/VendorVectorEncoder.js"
          );

        function FieldEncoderMap() {
          return {
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.version]:
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.created]:
              _DateEncoder_js__WEBPACK_IMPORTED_MODULE_2__.DateEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.lastUpdated]:
              _DateEncoder_js__WEBPACK_IMPORTED_MODULE_2__.DateEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.cmpId]:
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.cmpVersion]:
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.consentScreen]:
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .consentLanguage]:
              _LangEncoder_js__WEBPACK_IMPORTED_MODULE_5__.LangEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .vendorListVersion]:
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.policyVersion]:
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .isServiceSpecific]:
              _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_1__.BooleanEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .useNonStandardTexts]:
              _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_1__.BooleanEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .specialFeatureOptins]:
              _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .purposeConsents]:
              _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .purposeLegitimateInterests]:
              _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .purposeOneTreatment]:
              _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_1__.BooleanEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .publisherCountryCode]:
              _LangEncoder_js__WEBPACK_IMPORTED_MODULE_5__.LangEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .vendorConsents]:
              _VendorVectorEncoder_js__WEBPACK_IMPORTED_MODULE_7__.VendorVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .vendorLegitimateInterests]:
              _VendorVectorEncoder_js__WEBPACK_IMPORTED_MODULE_7__.VendorVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .publisherRestrictions]:
              _PurposeRestrictionVectorEncoder_js__WEBPACK_IMPORTED_MODULE_6__.PurposeRestrictionVectorEncoder,
            segmentType: _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .vendorsDisclosed]:
              _VendorVectorEncoder_js__WEBPACK_IMPORTED_MODULE_7__.VendorVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .vendorsAllowed]:
              _VendorVectorEncoder_js__WEBPACK_IMPORTED_MODULE_7__.VendorVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .publisherConsents]:
              _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .publisherLegitimateInterests]:
              _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .numCustomPurposes]:
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .publisherCustomConsents]:
              _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
              .publisherCustomLegitimateInterests]:
              _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
          };
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/FixedVectorEncoder.js":
      /*!**********************************************************!*\
  !*** ./iab-tcf-core/encoder/field/FixedVectorEncoder.js ***!
  \**********************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ FixedVectorEncoder: () =>
            /* binding */ FixedVectorEncoder,
          /* harmony export */
        });
        /* harmony import */ var _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./BooleanEncoder.js */ "./iab-tcf-core/encoder/field/BooleanEncoder.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class FixedVectorEncoder {
          static encode(value, numBits) {
            let bitString = "";

            for (let i = 1; i <= numBits; i++) {
              bitString +=
                _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_0__.BooleanEncoder.encode(
                  value.has(i)
                );
            }

            return bitString;
          }

          static decode(value, numBits) {
            if (value.length !== numBits) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.DecodingError(
                "bitfield encoding length mismatch"
              );
            }

            const vector =
              new _model_index_js__WEBPACK_IMPORTED_MODULE_2__.Vector();

            for (let i = 1; i <= numBits; i++) {
              if (
                _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_0__.BooleanEncoder.decode(
                  value[i - 1]
                )
              ) {
                vector.set(i);
              }
            }

            vector.bitLength = value.length;
            return vector;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/IntEncoder.js":
      /*!**************************************************!*\
  !*** ./iab-tcf-core/encoder/field/IntEncoder.js ***!
  \**************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ IntEncoder: () => /* binding */ IntEncoder,
          /* harmony export */
        });
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );

        class IntEncoder {
          static encode(value, numBits) {
            let bitString;

            if (typeof value === "string") {
              value = parseInt(value, 10);
            }

            bitString = value.toString(2);

            if (bitString.length > numBits || value < 0) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_0__.EncodingError(
                `${value} too large to encode into ${numBits}`
              );
            } // Pad the string if not filling all bits

            if (bitString.length < numBits) {
              // pad left
              bitString = "0".repeat(numBits - bitString.length) + bitString;
            }

            return bitString;
          }

          static decode(value, numBits) {
            if (numBits !== value.length) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_0__.DecodingError(
                "invalid bit length"
              );
            }

            return parseInt(value, 2);
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/LangEncoder.js":
      /*!***************************************************!*\
  !*** ./iab-tcf-core/encoder/field/LangEncoder.js ***!
  \***************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ LangEncoder: () => /* binding */ LangEncoder,
          /* harmony export */
        });
        /* harmony import */ var _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./IntEncoder.js */ "./iab-tcf-core/encoder/field/IntEncoder.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );

        class LangEncoder {
          static encode(value, numBits) {
            value = value.toUpperCase();
            const ASCII_START = 65;
            const firstLetter = value.charCodeAt(0) - ASCII_START;
            const secondLetter = value.charCodeAt(1) - ASCII_START; // check some things to throw some good errors

            if (
              firstLetter < 0 ||
              firstLetter > 25 ||
              secondLetter < 0 ||
              secondLetter > 25
            ) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.EncodingError(
                `invalid language code: ${value}`
              );
            }

            if (numBits % 2 === 1) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.EncodingError(
                `numBits must be even, ${numBits} is not valid`
              );
            }

            numBits = numBits / 2;
            const firstLetterBString =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__.IntEncoder.encode(
                firstLetter,
                numBits
              );
            const secondLetterBString =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__.IntEncoder.encode(
                secondLetter,
                numBits
              );
            return firstLetterBString + secondLetterBString;
          }

          static decode(value, numBits) {
            let retr; // is it an even number of bits? we have to divide it

            if (numBits === value.length && !(value.length % 2)) {
              const ASCII_START = 65;
              const mid = value.length / 2;
              const firstLetter =
                _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__.IntEncoder.decode(
                  value.slice(0, mid),
                  mid
                ) + ASCII_START;
              const secondLetter =
                _IntEncoder_js__WEBPACK_IMPORTED_MODULE_0__.IntEncoder.decode(
                  value.slice(mid),
                  mid
                ) + ASCII_START;
              retr =
                String.fromCharCode(firstLetter) +
                String.fromCharCode(secondLetter);
            } else {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.DecodingError(
                "invalid bit length for language"
              );
            }

            return retr;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/PurposeRestrictionVectorEncoder.js":
      /*!***********************************************************************!*\
  !*** ./iab-tcf-core/encoder/field/PurposeRestrictionVectorEncoder.js ***!
  \***********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ PurposeRestrictionVectorEncoder: () =>
            /* binding */ PurposeRestrictionVectorEncoder,
          /* harmony export */
        });
        /* harmony import */ var _BitLength_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../BitLength.js */ "./iab-tcf-core/encoder/BitLength.js"
          );
        /* harmony import */ var _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./BooleanEncoder.js */ "./iab-tcf-core/encoder/field/BooleanEncoder.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./IntEncoder.js */ "./iab-tcf-core/encoder/field/IntEncoder.js"
          );
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../../model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class PurposeRestrictionVectorEncoder {
          static encode(prVector) {
            // start with the number of restrictions
            let bitString =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.encode(
                prVector.numRestrictions,
                _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                  .numRestrictions
              ); // if the vector is empty we'll just return a string with just the numRestricitons being 0

            if (!prVector.isEmpty()) {
              const nextGvlVendor = (vendorId, lastVendorId) => {
                for (
                  let nextId = vendorId + 1;
                  nextId <= lastVendorId;
                  nextId++
                ) {
                  if (prVector.gvl.vendorIds.has(nextId)) {
                    return nextId;
                  }
                }

                return vendorId;
              }; // create each restriction group

              prVector.getRestrictions().forEach((purpRestriction) => {
                // every restriction group has the purposeId and the restrictionType;
                bitString +=
                  _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.encode(
                    purpRestriction.purposeId,
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .purposeId
                  );
                bitString +=
                  _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.encode(
                    purpRestriction.restrictionType,
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .restrictionType
                  ); // now get all the vendors under that restriction

                const vendors = prVector.getVendors(purpRestriction);
                const len = vendors.length;
                /**
                 * numEntries comes first so we will have to keep a counter and the do
                 * the encoding at the end
                 */

                let numEntries = 0;
                let startId = 0;
                let rangeField = "";

                for (let i = 0; i < len; i++) {
                  const vendorId = vendors[i];

                  if (startId === 0) {
                    numEntries++;
                    startId = vendorId;
                  }
                  /**
                   * either end of the loop or there are GVL vendor IDs before the next one
                   */

                  if (
                    i === len - 1 ||
                    vendors[i + 1] > nextGvlVendor(vendorId, vendors[len - 1])
                  ) {
                    /**
                     * it's a range entry if we've got something other than the start
                     * ID
                     */
                    const isRange = !(vendorId === startId); // 0 means single 1 means range

                    rangeField +=
                      _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_1__.BooleanEncoder.encode(
                        isRange
                      );
                    rangeField +=
                      _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.encode(
                        startId,
                        _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                          .vendorId
                      );

                    if (isRange) {
                      rangeField +=
                        _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.encode(
                          vendorId,
                          _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                            .vendorId
                        );
                    } // reset the startId so we grab the next id in the list

                    startId = 0;
                  }
                }
                /**
                 * now that  the range encoding is built, encode the number of ranges
                 * and then append the range field to the bitString.
                 */

                bitString +=
                  _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.encode(
                    numEntries,
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .numEntries
                  );
                bitString += rangeField;
              });
            }

            return bitString;
          }

          static decode(encodedString) {
            let index = 0;
            const vector =
              new _model_index_js__WEBPACK_IMPORTED_MODULE_4__.PurposeRestrictionVector();
            const numRestrictions =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.decode(
                encodedString.substr(
                  index,
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                    .numRestrictions
                ),
                _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                  .numRestrictions
              );
            index +=
              _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                .numRestrictions;

            for (let i = 0; i < numRestrictions; i++) {
              // First is purpose ID
              const purposeId =
                _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.decode(
                  encodedString.substr(
                    index,
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .purposeId
                  ),
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength.purposeId
                );
              index +=
                _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength.purposeId; // Second Restriction Type

              const restrictionType =
                _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.decode(
                  encodedString.substr(
                    index,
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .restrictionType
                  ),
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                    .restrictionType
                );
              index +=
                _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                  .restrictionType;
              const purposeRestriction =
                new _model_index_js__WEBPACK_IMPORTED_MODULE_4__.PurposeRestriction(
                  purposeId,
                  restrictionType
                ); // Num Entries (number of vendors)

              const numEntries =
                _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.decode(
                  encodedString.substr(
                    index,
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .numEntries
                  ),
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                    .numEntries
                );
              index +=
                _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength.numEntries;

              for (let j = 0; j < numEntries; j++) {
                const isARange =
                  _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_1__.BooleanEncoder.decode(
                    encodedString.substr(
                      index,
                      _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                        .anyBoolean
                    )
                  );
                index +=
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                    .anyBoolean;
                const startOrOnlyVendorId =
                  _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.decode(
                    encodedString.substr(
                      index,
                      _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                        .vendorId
                    ),
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .vendorId
                  );
                index +=
                  _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength.vendorId;

                if (isARange) {
                  const endVendorId =
                    _IntEncoder_js__WEBPACK_IMPORTED_MODULE_3__.IntEncoder.decode(
                      encodedString.substr(
                        index,
                        _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                          .vendorId
                      ),
                      _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                        .vendorId
                    );
                  index +=
                    _BitLength_js__WEBPACK_IMPORTED_MODULE_0__.BitLength
                      .vendorId;

                  if (endVendorId < startOrOnlyVendorId) {
                    throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_2__.DecodingError(
                      `Invalid RangeEntry: endVendorId ${endVendorId} is less than ${startOrOnlyVendorId}`
                    );
                  }

                  for (let k = startOrOnlyVendorId; k <= endVendorId; k++) {
                    vector.add(k, purposeRestriction);
                  }
                } else {
                  vector.add(startOrOnlyVendorId, purposeRestriction);
                }
              }
            }

            vector.bitLength = index;
            return vector;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/VectorEncodingType.js":
      /*!**********************************************************!*\
  !*** ./iab-tcf-core/encoder/field/VectorEncodingType.js ***!
  \**********************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ VectorEncodingType: () =>
            /* binding */ VectorEncodingType,
          /* harmony export */
        });
        var VectorEncodingType;

        (function (VectorEncodingType) {
          VectorEncodingType[(VectorEncodingType["FIELD"] = 0)] = "FIELD";
          VectorEncodingType[(VectorEncodingType["RANGE"] = 1)] = "RANGE";
        })(VectorEncodingType || (VectorEncodingType = {}));

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/VendorVectorEncoder.js":
      /*!***********************************************************!*\
  !*** ./iab-tcf-core/encoder/field/VendorVectorEncoder.js ***!
  \***********************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ VendorVectorEncoder: () =>
            /* binding */ VendorVectorEncoder,
          /* harmony export */
        });
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../model/index.js */ "./iab-tcf-core/model/index.js"
          );
        /* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../index.js */ "./iab-tcf-core/encoder/index.js"
          );
        /* harmony import */ var _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./IntEncoder.js */ "./iab-tcf-core/encoder/field/IntEncoder.js"
          );
        /* harmony import */ var _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./BooleanEncoder.js */ "./iab-tcf-core/encoder/field/BooleanEncoder.js"
          );
        /* harmony import */ var _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./FixedVectorEncoder.js */ "./iab-tcf-core/encoder/field/FixedVectorEncoder.js"
          );
        /* harmony import */ var _VectorEncodingType_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./VectorEncodingType.js */ "./iab-tcf-core/encoder/field/VectorEncodingType.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ../../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );

        class VendorVectorEncoder {
          static encode(value) {
            // collectors for range encoding
            const ranges = [];
            let range = []; // since both encodings need the maxId, start with that

            let retrString =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.encode(
                value.maxId,
                _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.maxId
              ); // bit field will be just the vendors as we walk through the vector

            let bitField = "";
            let rangeIsSmaller; // some math

            const headerLength =
              _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.maxId +
              _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.encodingType;
            const bitFieldLength = headerLength + value.maxId;
            const minRangeLength =
              _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId * 2 +
              _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.singleOrRange +
              _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.numEntries; // gets larger as we walk through the vector

            let rangeLength =
              headerLength +
              _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.numEntries; // walk through every value in the vector

            value.forEach((curValue, i) => {
              // build our bitfield no matter what
              bitField +=
                _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_3__.BooleanEncoder.encode(
                  curValue
                );
              /**
               * A range is a minimum of 45 bits, if the number of vendors in this
               * vector is less than 45 then we know that a bitfield encoding will be
               * shorter than any range encoding.
               *
               * The second check checks while we walk through the vector and abandons
               * building the ranges once it becomes larger
               */

              rangeIsSmaller =
                value.maxId > minRangeLength && rangeLength < bitFieldLength;
              /**
               * if the curValue is true and our rangeLength is less than the bitField
               * length, we'll continue to push these ranges into the array.  Once the
               * ranges become a larger encoding there is no reason to continue
               * building the structure because we will be choosing the bitfield
               * encoding
               */

              if (rangeIsSmaller && curValue) {
                /**
                 * Look ahead to see if this is the last value in our range
                 */
                const nextValue = value.has(i + 1); // if there isn't a next value, then we'll wrap up this range

                if (!nextValue) {
                  /**
                   * this is the last value of the range, so we'll push it on to the
                   * end into position 1
                   */
                  range.push(i); // add to the range length the additional vendorId

                  rangeLength +=
                    _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId; // store the array in our bigger array

                  ranges.push(range); // clear the array for the next range

                  range = [];
                } else if (range.length === 0) {
                  // this is the first  value for this range
                  range.push(i); // update our count with new range overhead

                  rangeLength +=
                    _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength
                      .singleOrRange;
                  rangeLength +=
                    _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId;
                }
              }
            });

            if (rangeIsSmaller) {
              retrString += String(
                _VectorEncodingType_js__WEBPACK_IMPORTED_MODULE_5__
                  .VectorEncodingType.RANGE
              );
              retrString += this.buildRangeEncoding(ranges);
            } else {
              retrString += String(
                _VectorEncodingType_js__WEBPACK_IMPORTED_MODULE_5__
                  .VectorEncodingType.FIELD
              );
              retrString += bitField;
            }

            return retrString;
          }

          static decode(value, version) {
            let vector;
            let index = 0;
            const maxId =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.decode(
                value.substr(
                  index,
                  _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.maxId
                ),
                _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.maxId
              );
            index += _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.maxId;
            const encodingType =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.decode(
                value.charAt(index),
                _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.encodingType
              );
            index +=
              _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.encodingType;
            /**
             * Range is handled in batches so we'll need a different decoding scheme
             */

            if (
              encodingType ===
              _VectorEncodingType_js__WEBPACK_IMPORTED_MODULE_5__
                .VectorEncodingType.RANGE
            ) {
              vector =
                new _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Vector();

              if (version === 1) {
                if (value.substr(index, 1) === "1") {
                  throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_6__.DecodingError(
                    "Unable to decode default consent=1"
                  );
                } // jump over the default encoding

                index++;
              }

              const numEntries =
                _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.decode(
                  value.substr(
                    index,
                    _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.numEntries
                  ),
                  _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.numEntries
                );
              index +=
                _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.numEntries; // loop through each group of entries

              for (let i = 0; i < numEntries; i++) {
                // Ranges can represent a single id or a range of ids.
                const isIdRange =
                  _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_3__.BooleanEncoder.decode(
                    value.charAt(index)
                  );
                index +=
                  _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength
                    .singleOrRange;
                /**
                 * regardless of whether or not it's a single entry or range, the next
                 * set of bits is a vendor ID
                 */

                const firstId =
                  _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.decode(
                    value.substr(
                      index,
                      _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId
                    ),
                    _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId
                  );
                index +=
                  _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId; // if it's a range, the next set of bits is the second id

                if (isIdRange) {
                  const secondId =
                    _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.decode(
                      value.substr(
                        index,
                        _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength
                          .vendorId
                      ),
                      _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId
                    );
                  index +=
                    _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId; // we'll need to set or unset all the vendor ids between the first and second

                  for (let j = firstId; j <= secondId; j++) {
                    vector.set(j);
                  }
                } else {
                  vector.set(firstId);
                }
              }
            } else {
              const bitField = value.substr(index, maxId);
              index += maxId;
              vector =
                _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_4__.FixedVectorEncoder.decode(
                  bitField,
                  maxId
                );
            }

            vector.bitLength = index;
            return vector;
          }

          static buildRangeEncoding(ranges) {
            // describe the number of entries to follow
            const numEntries = ranges.length;
            let rangeString =
              _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.encode(
                numEntries,
                _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.numEntries
              ); // each range

            ranges.forEach((range) => {
              // is this range a single?
              const single = range.length === 1; // first is the indicator of whether this is a single id or range (two)
              // 0 is single and range is 1

              rangeString +=
                _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_3__.BooleanEncoder.encode(
                  !single
                ); // second is the first (or only) vendorId

              rangeString +=
                _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.encode(
                  range[0],
                  _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId
                );

              if (!single) {
                // add the second id if it exists
                rangeString +=
                  _IntEncoder_js__WEBPACK_IMPORTED_MODULE_2__.IntEncoder.encode(
                    range[1],
                    _index_js__WEBPACK_IMPORTED_MODULE_1__.BitLength.vendorId
                  );
              }
            });
            return rangeString;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/field/index.js":
      /*!*********************************************!*\
  !*** ./iab-tcf-core/encoder/field/index.js ***!
  \*********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ BooleanEncoder: () =>
            /* reexport safe */ _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_0__.BooleanEncoder,
          /* harmony export */ DateEncoder: () =>
            /* reexport safe */ _DateEncoder_js__WEBPACK_IMPORTED_MODULE_1__.DateEncoder,
          /* harmony export */ FieldEncoderMap: () =>
            /* reexport safe */ _FieldEncoderMap_js__WEBPACK_IMPORTED_MODULE_2__.FieldEncoderMap,
          /* harmony export */ FixedVectorEncoder: () =>
            /* reexport safe */ _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__.FixedVectorEncoder,
          /* harmony export */ IntEncoder: () =>
            /* reexport safe */ _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__.IntEncoder,
          /* harmony export */ LangEncoder: () =>
            /* reexport safe */ _LangEncoder_js__WEBPACK_IMPORTED_MODULE_5__.LangEncoder,
          /* harmony export */ PurposeRestrictionVectorEncoder: () =>
            /* reexport safe */ _PurposeRestrictionVectorEncoder_js__WEBPACK_IMPORTED_MODULE_6__.PurposeRestrictionVectorEncoder,
          /* harmony export */ VectorEncodingType: () =>
            /* reexport safe */ _VectorEncodingType_js__WEBPACK_IMPORTED_MODULE_7__.VectorEncodingType,
          /* harmony export */ VendorVectorEncoder: () =>
            /* reexport safe */ _VendorVectorEncoder_js__WEBPACK_IMPORTED_MODULE_8__.VendorVectorEncoder,
          /* harmony export */
        });
        /* harmony import */ var _BooleanEncoder_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./BooleanEncoder.js */ "./iab-tcf-core/encoder/field/BooleanEncoder.js"
          );
        /* harmony import */ var _DateEncoder_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./DateEncoder.js */ "./iab-tcf-core/encoder/field/DateEncoder.js"
          );
        /* harmony import */ var _FieldEncoderMap_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./FieldEncoderMap.js */ "./iab-tcf-core/encoder/field/FieldEncoderMap.js"
          );
        /* harmony import */ var _FixedVectorEncoder_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./FixedVectorEncoder.js */ "./iab-tcf-core/encoder/field/FixedVectorEncoder.js"
          );
        /* harmony import */ var _IntEncoder_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./IntEncoder.js */ "./iab-tcf-core/encoder/field/IntEncoder.js"
          );
        /* harmony import */ var _LangEncoder_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./LangEncoder.js */ "./iab-tcf-core/encoder/field/LangEncoder.js"
          );
        /* harmony import */ var _PurposeRestrictionVectorEncoder_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./PurposeRestrictionVectorEncoder.js */ "./iab-tcf-core/encoder/field/PurposeRestrictionVectorEncoder.js"
          );
        /* harmony import */ var _VectorEncodingType_js__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ./VectorEncodingType.js */ "./iab-tcf-core/encoder/field/VectorEncodingType.js"
          );
        /* harmony import */ var _VendorVectorEncoder_js__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! ./VendorVectorEncoder.js */ "./iab-tcf-core/encoder/field/VendorVectorEncoder.js"
          );

        /***/
      },

    /***/ "./iab-tcf-core/encoder/index.js":
      /*!***************************************!*\
  !*** ./iab-tcf-core/encoder/index.js ***!
  \***************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Base64Url: () =>
            /* reexport safe */ _Base64Url_js__WEBPACK_IMPORTED_MODULE_0__.Base64Url,
          /* harmony export */ BitLength: () =>
            /* reexport safe */ _BitLength_js__WEBPACK_IMPORTED_MODULE_1__.BitLength,
          /* harmony export */ BooleanEncoder: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.BooleanEncoder,
          /* harmony export */ DateEncoder: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.DateEncoder,
          /* harmony export */ FieldEncoderMap: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.FieldEncoderMap,
          /* harmony export */ FieldSequence: () =>
            /* reexport safe */ _sequence_index_js__WEBPACK_IMPORTED_MODULE_6__.FieldSequence,
          /* harmony export */ FixedVectorEncoder: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.FixedVectorEncoder,
          /* harmony export */ IntEncoder: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.IntEncoder,
          /* harmony export */ LangEncoder: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.LangEncoder,
          /* harmony export */ PurposeRestrictionVectorEncoder: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.PurposeRestrictionVectorEncoder,
          /* harmony export */ SegmentEncoder: () =>
            /* reexport safe */ _SegmentEncoder_js__WEBPACK_IMPORTED_MODULE_3__.SegmentEncoder,
          /* harmony export */ SegmentSequence: () =>
            /* reexport safe */ _sequence_index_js__WEBPACK_IMPORTED_MODULE_6__.SegmentSequence,
          /* harmony export */ SemanticPreEncoder: () =>
            /* reexport safe */ _SemanticPreEncoder_js__WEBPACK_IMPORTED_MODULE_4__.SemanticPreEncoder,
          /* harmony export */ VectorEncodingType: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.VectorEncodingType,
          /* harmony export */ VendorVectorEncoder: () =>
            /* reexport safe */ _field_index_js__WEBPACK_IMPORTED_MODULE_5__.VendorVectorEncoder,
          /* harmony export */
        });
        /* harmony import */ var _Base64Url_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./Base64Url.js */ "./iab-tcf-core/encoder/Base64Url.js"
          );
        /* harmony import */ var _BitLength_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./BitLength.js */ "./iab-tcf-core/encoder/BitLength.js"
          );
        /* harmony import */ var _EncodingOptions_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./EncodingOptions.js */ "./iab-tcf-core/encoder/EncodingOptions.js"
          );
        /* harmony import */ var _SegmentEncoder_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./SegmentEncoder.js */ "./iab-tcf-core/encoder/SegmentEncoder.js"
          );
        /* harmony import */ var _SemanticPreEncoder_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./SemanticPreEncoder.js */ "./iab-tcf-core/encoder/SemanticPreEncoder.js"
          );
        /* harmony import */ var _field_index_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./field/index.js */ "./iab-tcf-core/encoder/field/index.js"
          );
        /* harmony import */ var _sequence_index_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./sequence/index.js */ "./iab-tcf-core/encoder/sequence/index.js"
          );

        /***/
      },

    /***/ "./iab-tcf-core/encoder/sequence/FieldSequence.js":
      /*!********************************************************!*\
  !*** ./iab-tcf-core/encoder/sequence/FieldSequence.js ***!
  \********************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ FieldSequence: () => /* binding */ FieldSequence,
          /* harmony export */
        });
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class FieldSequence {
          1 = {
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment.CORE]: [
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.version,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.created,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.lastUpdated,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.cmpId,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.cmpVersion,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.consentScreen,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .consentLanguage,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .vendorListVersion,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .purposeConsents,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .vendorConsents,
            ],
          };
          2 = {
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment.CORE]: [
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.version,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.created,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.lastUpdated,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.cmpId,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.cmpVersion,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.consentScreen,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .consentLanguage,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .vendorListVersion,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields.policyVersion,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .isServiceSpecific,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .useNonStandardTexts,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .specialFeatureOptins,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .purposeConsents,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .purposeLegitimateInterests,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .purposeOneTreatment,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .publisherCountryCode,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .vendorConsents,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .vendorLegitimateInterests,
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .publisherRestrictions,
            ],
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment.PUBLISHER_TC]:
              [
                _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                  .publisherConsents,
                _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                  .publisherLegitimateInterests,
                _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                  .numCustomPurposes,
                _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                  .publisherCustomConsents,
                _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                  .publisherCustomLegitimateInterests,
              ],
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment
              .VENDORS_ALLOWED]: [
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .vendorsAllowed,
            ],
            [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment
              .VENDORS_DISCLOSED]: [
              _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                .vendorsDisclosed,
            ],
          };
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/sequence/SegmentSequence.js":
      /*!**********************************************************!*\
  !*** ./iab-tcf-core/encoder/sequence/SegmentSequence.js ***!
  \**********************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ SegmentSequence: () =>
            /* binding */ SegmentSequence,
          /* harmony export */
        });
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../model/index.js */ "./iab-tcf-core/model/index.js"
          );

        class SegmentSequence {
          1 = [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment.CORE];
          2 = [_model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment.CORE];

          constructor(tcModel, options) {
            if (tcModel.version === 2) {
              if (tcModel.isServiceSpecific) {
                /**
                 * If it's service specific only, then the publisher TC String can be
                 * stored in the cookie and would be transmitted if it's not for
                 * storage.  So it's included regardless of whether or not it's for
                 * saving or the cmp api to surface.
                 */
                this["2"].push(
                  _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment
                    .PUBLISHER_TC
                );
              } else {
                const isForVendors = !!(options && options.isForVendors);
                /**
                 * including vendors disclosed only if it is for saving (to the global
                 * scope and not for vendors through the CMP API) or supportOOB is
                 * turned on (either or both).  The compliment of this being not for
                 * saving (surfaced to CMP) and no support of OOB.
                 */

                if (
                  !isForVendors ||
                  tcModel[
                    _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                      .supportOOB
                  ] === true
                ) {
                  this["2"].push(
                    _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment
                      .VENDORS_DISCLOSED
                  );
                }

                if (isForVendors) {
                  /**
                   * If a publisher does support OOB and they have narrowed the allowed
                   * vendors to utilize it, then we should include the vendors allowed
                   * segment.  If it is empty then there are no restrictions, if that
                   * is intended to mean no support for OOB, then the flag should be
                   * set for that instead.
                   *
                   */
                  if (
                    tcModel[
                      _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                        .supportOOB
                    ] &&
                    tcModel[
                      _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Fields
                        .vendorsAllowed
                    ].size > 0
                  ) {
                    this["2"].push(
                      _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment
                        .VENDORS_ALLOWED
                    );
                  }
                  /**
                   * Always include the publisher TC segment as long as this TC string
                   * is not intended to be saved in the global scope.
                   */

                  this["2"].push(
                    _model_index_js__WEBPACK_IMPORTED_MODULE_0__.Segment
                      .PUBLISHER_TC
                  );
                }
              }
            }
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/encoder/sequence/SequenceVersionMap.js":
      /*!*************************************************************!*\
  !*** ./iab-tcf-core/encoder/sequence/SequenceVersionMap.js ***!
  \*************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/encoder/sequence/index.js":
      /*!************************************************!*\
  !*** ./iab-tcf-core/encoder/sequence/index.js ***!
  \************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ FieldSequence: () =>
            /* reexport safe */ _FieldSequence_js__WEBPACK_IMPORTED_MODULE_0__.FieldSequence,
          /* harmony export */ SegmentSequence: () =>
            /* reexport safe */ _SegmentSequence_js__WEBPACK_IMPORTED_MODULE_1__.SegmentSequence,
          /* harmony export */
        });
        /* harmony import */ var _FieldSequence_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./FieldSequence.js */ "./iab-tcf-core/encoder/sequence/FieldSequence.js"
          );
        /* harmony import */ var _SegmentSequence_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./SegmentSequence.js */ "./iab-tcf-core/encoder/sequence/SegmentSequence.js"
          );
        /* harmony import */ var _SequenceVersionMap_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./SequenceVersionMap.js */ "./iab-tcf-core/encoder/sequence/SequenceVersionMap.js"
          );
        // created from 'create-ts-index'

        /***/
      },

    /***/ "./iab-tcf-core/errors/DecodingError.js":
      /*!**********************************************!*\
  !*** ./iab-tcf-core/errors/DecodingError.js ***!
  \**********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ DecodingError: () => /* binding */ DecodingError,
          /* harmony export */
        });
        /**
         * class for decoding errors
         *
         * @extends {Error}
         */
        class DecodingError extends Error {
          /**
           * constructor - constructs an DecodingError
           *
           * @param {string} msg - Decoding Error Message
           * @return {undefined}
           */
          constructor(msg) {
            super(msg);
            this.name = "DecodingError";
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/errors/EncodingError.js":
      /*!**********************************************!*\
  !*** ./iab-tcf-core/errors/EncodingError.js ***!
  \**********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ EncodingError: () => /* binding */ EncodingError,
          /* harmony export */
        });
        /**
         * class for encoding errors
         *
         * @extends {Error}
         */
        class EncodingError extends Error {
          /**
           * constructor - constructs an EncodingError
           *
           * @param {string} msg - Encoding Error Message
           * @return {undefined}
           */
          constructor(msg) {
            super(msg);
            this.name = "EncodingError";
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/errors/GVLError.js":
      /*!*****************************************!*\
  !*** ./iab-tcf-core/errors/GVLError.js ***!
  \*****************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ GVLError: () => /* binding */ GVLError,
          /* harmony export */
        });
        /**
         * class for General GVL Errors
         *
         * @extends {Error}
         */
        class GVLError extends Error {
          /**
           * constructor - constructs a GVLError
           *
           * @param {string} msg - Error message to display
           * @return {undefined}
           */
          constructor(msg) {
            super(msg);
            this.name = "GVLError";
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/errors/TCModelError.js":
      /*!*********************************************!*\
  !*** ./iab-tcf-core/errors/TCModelError.js ***!
  \*********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ TCModelError: () => /* binding */ TCModelError,
          /* harmony export */
        });
        /**
         * class for decoding errors
         *
         * @extends {Error}
         */
        class TCModelError extends Error {
          /**
           * constructor - constructs an TCModelError
           *
           * @param {string} fieldName - the errored field
           * @param {string} passedValue - what was passed
           * @return {undefined}
           */
          constructor(fieldName, passedValue, msg = "") {
            super(
              `invalid value ${passedValue} passed for ${fieldName} ${msg}`
            );
            this.name = "TCModelError";
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/errors/index.js":
      /*!**************************************!*\
  !*** ./iab-tcf-core/errors/index.js ***!
  \**************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ DecodingError: () =>
            /* reexport safe */ _DecodingError_js__WEBPACK_IMPORTED_MODULE_0__.DecodingError,
          /* harmony export */ EncodingError: () =>
            /* reexport safe */ _EncodingError_js__WEBPACK_IMPORTED_MODULE_1__.EncodingError,
          /* harmony export */ GVLError: () =>
            /* reexport safe */ _GVLError_js__WEBPACK_IMPORTED_MODULE_2__.GVLError,
          /* harmony export */ TCModelError: () =>
            /* reexport safe */ _TCModelError_js__WEBPACK_IMPORTED_MODULE_3__.TCModelError,
          /* harmony export */
        });
        /* harmony import */ var _DecodingError_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./DecodingError.js */ "./iab-tcf-core/errors/DecodingError.js"
          );
        /* harmony import */ var _EncodingError_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./EncodingError.js */ "./iab-tcf-core/errors/EncodingError.js"
          );
        /* harmony import */ var _GVLError_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./GVLError.js */ "./iab-tcf-core/errors/GVLError.js"
          );
        /* harmony import */ var _TCModelError_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./TCModelError.js */ "./iab-tcf-core/errors/TCModelError.js"
          );

        /***/
      },

    /***/ "./iab-tcf-core/index.js":
      /*!*******************************!*\
  !*** ./iab-tcf-core/index.js ***!
  \*******************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Base64Url: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.Base64Url,
          /* harmony export */ BitLength: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.BitLength,
          /* harmony export */ BooleanEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.BooleanEncoder,
          /* harmony export */ Cloneable: () =>
            /* reexport safe */ _Cloneable_js__WEBPACK_IMPORTED_MODULE_3__.Cloneable,
          /* harmony export */ ConsentLanguages: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.ConsentLanguages,
          /* harmony export */ DateEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.DateEncoder,
          /* harmony export */ DecodingError: () =>
            /* reexport safe */ _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.DecodingError,
          /* harmony export */ DeviceDisclosureStorageAccessType: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.DeviceDisclosureStorageAccessType,
          /* harmony export */ EncodingError: () =>
            /* reexport safe */ _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.EncodingError,
          /* harmony export */ FieldEncoderMap: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.FieldEncoderMap,
          /* harmony export */ FieldSequence: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.FieldSequence,
          /* harmony export */ Fields: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.Fields,
          /* harmony export */ FixedVectorEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.FixedVectorEncoder,
          /* harmony export */ GVL: () =>
            /* reexport safe */ _GVL_js__WEBPACK_IMPORTED_MODULE_4__.GVL,
          /* harmony export */ GVLError: () =>
            /* reexport safe */ _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.GVLError,
          /* harmony export */ IntEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.IntEncoder,
          /* harmony export */ Json: () =>
            /* reexport safe */ _Json_js__WEBPACK_IMPORTED_MODULE_5__.Json,
          /* harmony export */ LangEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.LangEncoder,
          /* harmony export */ PurposeRestriction: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.PurposeRestriction,
          /* harmony export */ PurposeRestrictionVector: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.PurposeRestrictionVector,
          /* harmony export */ PurposeRestrictionVectorEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.PurposeRestrictionVectorEncoder,
          /* harmony export */ RestrictionType: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.RestrictionType,
          /* harmony export */ Segment: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.Segment,
          /* harmony export */ SegmentEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.SegmentEncoder,
          /* harmony export */ SegmentIDs: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.SegmentIDs,
          /* harmony export */ SegmentSequence: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.SegmentSequence,
          /* harmony export */ SemanticPreEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.SemanticPreEncoder,
          /* harmony export */ TCModel: () =>
            /* reexport safe */ _TCModel_js__WEBPACK_IMPORTED_MODULE_6__.TCModel,
          /* harmony export */ TCModelError: () =>
            /* reexport safe */ _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError,
          /* harmony export */ TCString: () =>
            /* reexport safe */ _TCString_js__WEBPACK_IMPORTED_MODULE_7__.TCString,
          /* harmony export */ Vector: () =>
            /* reexport safe */ _model_index_js__WEBPACK_IMPORTED_MODULE_2__.Vector,
          /* harmony export */ VectorEncodingType: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.VectorEncodingType,
          /* harmony export */ VendorVectorEncoder: () =>
            /* reexport safe */ _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__.VendorVectorEncoder,
          /* harmony export */
        });
        /* harmony import */ var _encoder_index_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./encoder/index.js */ "./iab-tcf-core/encoder/index.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _model_index_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./model/index.js */ "./iab-tcf-core/model/index.js"
          );
        /* harmony import */ var _Cloneable_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./Cloneable.js */ "./iab-tcf-core/Cloneable.js"
          );
        /* harmony import */ var _GVL_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(/*! ./GVL.js */ "./iab-tcf-core/GVL.js");
        /* harmony import */ var _Json_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(/*! ./Json.js */ "./iab-tcf-core/Json.js");
        /* harmony import */ var _TCModel_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(/*! ./TCModel.js */ "./iab-tcf-core/TCModel.js");
        /* harmony import */ var _TCString_js__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ./TCString.js */ "./iab-tcf-core/TCString.js"
          );
        // created from 'create-ts-index'

        /***/
      },

    /***/ "./iab-tcf-core/model/ConsentLanguages.js":
      /*!************************************************!*\
  !*** ./iab-tcf-core/model/ConsentLanguages.js ***!
  \************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ConsentLanguages: () =>
            /* binding */ ConsentLanguages,
          /* harmony export */
        });
        class ConsentLanguages {
          static langSet = new Set([
            "AR",
            "BG",
            "BS",
            "CA",
            "CS",
            "CY",
            "DA",
            "DE",
            "EL",
            "EN",
            "ES",
            "ET",
            "EU",
            "FI",
            "FR",
            "GL",
            "HR",
            "HU",
            "IT",
            "JA",
            "LT",
            "LV",
            "MT",
            "NL",
            "NO",
            "PL",
            "PT-BR",
            "PT",
            "RO",
            "RU",
            "SK",
            "SL",
            "SR-LATN",
            "SR",
            "SV",
            "TR",
            "UK",
            "ZH",
          ]);

          has(key) {
            return ConsentLanguages.langSet.has(key);
          }

          parseLanguage(lang) {
            lang = lang.toUpperCase();
            const primaryLanguage = lang.split("-")[0];

            if (lang.length >= 2 && primaryLanguage.length == 2) {
              if (ConsentLanguages.langSet.has(lang)) {
                return lang;
              } else if (ConsentLanguages.langSet.has(primaryLanguage)) {
                return primaryLanguage;
              }

              const fullPrimaryLang = primaryLanguage + "-" + primaryLanguage;

              if (ConsentLanguages.langSet.has(fullPrimaryLang)) {
                return fullPrimaryLang;
              }

              for (const supportedLang of ConsentLanguages.langSet) {
                if (
                  supportedLang.indexOf(lang) !== -1 ||
                  supportedLang.indexOf(primaryLanguage) !== -1
                ) {
                  return supportedLang;
                }
              }
            }

            throw new Error(`unsupported language ${lang}`);
          }

          forEach(callback) {
            ConsentLanguages.langSet.forEach(callback);
          }

          get size() {
            return ConsentLanguages.langSet.size;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/model/DeviceDisclosure.js":
      /*!************************************************!*\
  !*** ./iab-tcf-core/model/DeviceDisclosure.js ***!
  \************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/DeviceDisclosureStorageAccessType.js":
      /*!*****************************************************************!*\
  !*** ./iab-tcf-core/model/DeviceDisclosureStorageAccessType.js ***!
  \*****************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ DeviceDisclosureStorageAccessType: () =>
            /* binding */ DeviceDisclosureStorageAccessType,
          /* harmony export */
        });
        var DeviceDisclosureStorageAccessType;

        (function (DeviceDisclosureStorageAccessType) {
          DeviceDisclosureStorageAccessType["COOKIE"] = "cookie";
          DeviceDisclosureStorageAccessType["WEB"] = "web";
          DeviceDisclosureStorageAccessType["APP"] = "app";
        })(
          DeviceDisclosureStorageAccessType ||
            (DeviceDisclosureStorageAccessType = {})
        );

        /***/
      },

    /***/ "./iab-tcf-core/model/Fields.js":
      /*!**************************************!*\
  !*** ./iab-tcf-core/model/Fields.js ***!
  \**************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Fields: () => /* binding */ Fields,
          /* harmony export */
        });
        class Fields {
          static cmpId = "cmpId";
          static cmpVersion = "cmpVersion";
          static consentLanguage = "consentLanguage";
          static consentScreen = "consentScreen";
          static created = "created";
          static supportOOB = "supportOOB";
          static isServiceSpecific = "isServiceSpecific";
          static lastUpdated = "lastUpdated";
          static numCustomPurposes = "numCustomPurposes";
          static policyVersion = "policyVersion";
          static publisherCountryCode = "publisherCountryCode";
          static publisherCustomConsents = "publisherCustomConsents";
          static publisherCustomLegitimateInterests =
            "publisherCustomLegitimateInterests";
          static publisherLegitimateInterests = "publisherLegitimateInterests";
          static publisherConsents = "publisherConsents";
          static publisherRestrictions = "publisherRestrictions";
          static purposeConsents = "purposeConsents";
          static purposeLegitimateInterests = "purposeLegitimateInterests";
          static purposeOneTreatment = "purposeOneTreatment";
          static specialFeatureOptins = "specialFeatureOptins";
          static useNonStandardTexts = "useNonStandardTexts";
          static vendorConsents = "vendorConsents";
          static vendorLegitimateInterests = "vendorLegitimateInterests";
          static vendorListVersion = "vendorListVersion";
          static vendorsAllowed = "vendorsAllowed";
          static vendorsDisclosed = "vendorsDisclosed";
          static version = "version";
        }

        /***/
      },

    /***/ "./iab-tcf-core/model/IntMap.js":
      /*!**************************************!*\
  !*** ./iab-tcf-core/model/IntMap.js ***!
  \**************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/KeyMap.js":
      /*!**************************************!*\
  !*** ./iab-tcf-core/model/KeyMap.js ***!
  \**************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/PurposeRestriction.js":
      /*!**************************************************!*\
  !*** ./iab-tcf-core/model/PurposeRestriction.js ***!
  \**************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ PurposeRestriction: () =>
            /* binding */ PurposeRestriction,
          /* harmony export */
        });
        /* harmony import */ var _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../Cloneable.js */ "./iab-tcf-core/Cloneable.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );
        /* harmony import */ var _RestrictionType_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./RestrictionType.js */ "./iab-tcf-core/model/RestrictionType.js"
          );

        class PurposeRestriction extends _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__.Cloneable {
          static hashSeparator = "-";
          purposeId_;
          restrictionType;
          /**
           * constructor
           *
           * @param {number} purposeId? - may optionally pass the purposeId into the
           * constructor
           * @param {RestrictionType} restrictionType? - may
           * optionally pass the restrictionType into the constructor
           * @return {undefined}
           */

          constructor(purposeId, restrictionType) {
            super();

            if (purposeId !== undefined) {
              this.purposeId = purposeId;
            }

            if (restrictionType !== undefined) {
              this.restrictionType = restrictionType;
            }
          }

          static unHash(hash) {
            const splitUp = hash.split(this.hashSeparator);
            const purpRestriction = new PurposeRestriction();

            if (splitUp.length !== 2) {
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "hash",
                hash
              );
            }

            purpRestriction.purposeId = parseInt(splitUp[0], 10);
            purpRestriction.restrictionType = parseInt(splitUp[1], 10);
            return purpRestriction;
          }

          get hash() {
            if (!this.isValid()) {
              throw new Error("cannot hash invalid PurposeRestriction");
            }

            return `${this.purposeId}${PurposeRestriction.hashSeparator}${this.restrictionType}`;
          }
          /**
           * @return {number} The purpose Id associated with a publisher
           * purpose-by-vendor restriction that resulted in a different consent or LI
           * status than the consent or LI purposes allowed lists.
           */

          get purposeId() {
            return this.purposeId_;
          }
          /**
           * @param {number} idNum - The purpose Id associated with a publisher
           * purpose-by-vendor restriction that resulted in a different consent or LI
           * status than the consent or LI purposes allowed lists.
           */

          set purposeId(idNum) {
            this.purposeId_ = idNum;
          }

          isValid() {
            return (
              Number.isInteger(this.purposeId) &&
              this.purposeId > 0 &&
              (this.restrictionType ===
                _RestrictionType_js__WEBPACK_IMPORTED_MODULE_2__.RestrictionType
                  .NOT_ALLOWED ||
                this.restrictionType ===
                  _RestrictionType_js__WEBPACK_IMPORTED_MODULE_2__
                    .RestrictionType.REQUIRE_CONSENT ||
                this.restrictionType ===
                  _RestrictionType_js__WEBPACK_IMPORTED_MODULE_2__
                    .RestrictionType.REQUIRE_LI)
            );
          }

          isSameAs(otherPR) {
            return (
              this.purposeId === otherPR.purposeId &&
              this.restrictionType === otherPR.restrictionType
            );
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/model/PurposeRestrictionVector.js":
      /*!********************************************************!*\
  !*** ./iab-tcf-core/model/PurposeRestrictionVector.js ***!
  \********************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ PurposeRestrictionVector: () =>
            /* binding */ PurposeRestrictionVector,
          /* harmony export */
        });
        /* harmony import */ var _PurposeRestriction_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./PurposeRestriction.js */ "./iab-tcf-core/model/PurposeRestriction.js"
          );
        /* harmony import */ var _RestrictionType_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./RestrictionType.js */ "./iab-tcf-core/model/RestrictionType.js"
          );
        /* harmony import */ var _Cloneable_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../Cloneable.js */ "./iab-tcf-core/Cloneable.js"
          );

        class PurposeRestrictionVector extends _Cloneable_js__WEBPACK_IMPORTED_MODULE_2__.Cloneable {
          /**
           * if this originatd from an encoded string we'll need a place to store the
           * bit length; it can be set and got from here
           */
          bitLength = 0;
          /**
           * a map indexed by a string which will be a 'hash' of the purpose and
           * restriction type.
           */

          map = new Map();
          gvl_;

          has(hash) {
            return this.map.has(hash);
          }

          isOkToHave(restrictionType, purposeId, vendorId) {
            let result = true;
            /**
             * without a gvl set, there's no way to know... in that case we'll return
             * true but once the GVL is set later we'll go through these and clean up
             * the mess.
             */

            if (this.gvl?.vendors) {
              const vendor = this.gvl.vendors[vendorId];

              if (vendor) {
                if (
                  restrictionType ===
                  _RestrictionType_js__WEBPACK_IMPORTED_MODULE_1__
                    .RestrictionType.NOT_ALLOWED
                ) {
                  /**
                   * if it's "not allowed" then flexible declaration is ignored but if
                   * if it isn't even listed as one of the purposes the vendor uses,
                   * then there is no reason to encode the value so check both arrays
                   * to see if it exists.  If it does then we can restrict it.
                   */
                  result =
                    vendor.legIntPurposes.includes(purposeId) ||
                    vendor.purposes.includes(purposeId);
                } else if (vendor.flexiblePurposes.length) {
                  switch (restrictionType) {
                    /**
                     * If the vendor has the purposeId in flexiblePurposes and it is
                     * listed as a legitimate interest purpose we can set the
                     * override to require consent.
                     */
                    case _RestrictionType_js__WEBPACK_IMPORTED_MODULE_1__
                      .RestrictionType.REQUIRE_CONSENT:
                      result =
                        vendor.flexiblePurposes.includes(purposeId) &&
                        vendor.legIntPurposes.includes(purposeId);
                      break;

                    /**
                     * If the vendor has the purposeId in flexiblePurposes and it is
                     * listed as a consent purpose we can set the
                     * override to require legitimate interest.
                     */

                    case _RestrictionType_js__WEBPACK_IMPORTED_MODULE_1__
                      .RestrictionType.REQUIRE_LI:
                      result =
                        vendor.flexiblePurposes.includes(purposeId) &&
                        vendor.purposes.includes(purposeId);
                      break;
                  }
                } else {
                  result = false;
                }
              } else {
                // this vendor doesn't exist
                result = false;
              }
            } // if the gvl isn't defined, we can't do anything until later

            return result;
          }
          /**
           * add - adds a given Vendor ID under a given Purpose Restriction
           *
           * @param {number} vendorId
           * @param {PurposeRestriction} purposeRestriction
           * @return {void}
           */

          add(vendorId, purposeRestriction) {
            if (
              this.isOkToHave(
                purposeRestriction.restrictionType,
                purposeRestriction.purposeId,
                vendorId
              )
            ) {
              const hash = purposeRestriction.hash;

              if (!this.has(hash)) {
                this.map.set(hash, new Set());
                this.bitLength = 0;
              }
              /**
               * Previously I had a check here to remove a duplicate value, but because
               * we're using a tree the value is guaranteed to be unique so there is no
               * need to add an additional de-duplication here.
               */

              this.map.get(hash).add(vendorId);
            }
          }
          /**
           * restrictPurposeToLegalBasis - adds all Vendors under a given Purpose Restriction
           *
           * @param {PurposeRestriction} purposeRestriction
           * @return {void}
           */

          restrictPurposeToLegalBasis(purposeRestriction) {
            const vendors = Array.from(this.gvl.vendorIds);
            const hash = purposeRestriction.hash;
            const lastEntry = vendors[vendors.length - 1];
            /**
             * Create an ordered array of vendor IDs from `1` (the minimum value for Vendor ID) to `lastEntry`
             */

            const values = [...Array(lastEntry).keys()].map((i) => i + 1);

            if (!this.has(hash)) {
              this.map.set(hash, new Set(values)); // use static method `build` to create a `BST` from the ordered array of IDs

              this.bitLength = 0;
            } else {
              for (let i = 1; i <= lastEntry; i++) {
                /**
                 * Previously I had a check here to remove a duplicate value, but because
                 * we're using a tree the value is guaranteed to be unique so there is no
                 * need to add an additional de-duplication here.
                 */
                this.map.get(hash).add(i);
              }
            }
          }
          /**
           * getVendors - returns array of vendor ids optionally narrowed by a given
           * Purpose Restriction.  If no purpose restriction is passed then all vendor
           * ids will be returned.  One can expect this result to be a unique set of
           * ids no duplicates.
           *
           * @param {PurposeRestriction} [purposeRestriction] - optionally passed to
           * get only Vendor IDs restricted under the given Purpose Restriction
           * @return {number[]} - Unique ID set of vendors
           */

          getVendors(purposeRestriction) {
            let vendorIds = [];

            if (purposeRestriction) {
              const hash = purposeRestriction.hash;

              if (this.has(hash)) {
                vendorIds = Array.from(this.map.get(hash));
              }
            } else {
              const vendorSet = new Set();
              this.map.forEach((set) => {
                set.forEach((vendorId) => {
                  vendorSet.add(vendorId);
                });
              });
              vendorIds = Array.from(vendorSet);
            }

            return vendorIds.sort((a, b) => a - b);
          }

          getRestrictionType(vendorId, purposeId) {
            let rType;
            this.getRestrictions(vendorId).forEach((purposeRestriction) => {
              if (purposeRestriction.purposeId === purposeId) {
                if (
                  rType === undefined ||
                  rType > purposeRestriction.restrictionType
                ) {
                  rType = purposeRestriction.restrictionType;
                }
              }
            });
            return rType;
          }
          /**
           * vendorHasRestriction - determines whether a given Vendor ID is under a
           * given Purpose Restriction
           *
           * @param {number} vendorId
           * @param {PurposeRestriction} purposeRestriction
           * @return {boolean} - true if the give Vendor ID is under the given Purpose
           * Restriction
           */

          vendorHasRestriction(vendorId, purposeRestriction) {
            let has = false;
            const restrictions = this.getRestrictions(vendorId);

            for (let i = 0; i < restrictions.length && !has; i++) {
              has = purposeRestriction.isSameAs(restrictions[i]);
            }

            return has;
          }
          /**
           * getMaxVendorId - gets the Maximum Vendor ID regardless of Purpose
           * Restriction
           *
           * @return {number} - maximum Vendor ID
           */

          getMaxVendorId() {
            let retr = 0;
            this.map.forEach((set) => {
              retr = Math.max(Array.from(set)[set.size - 1], retr);
            });
            return retr;
          }

          getRestrictions(vendorId) {
            const retr = [];
            this.map.forEach((set, hash) => {
              if (vendorId) {
                if (set.has(vendorId)) {
                  retr.push(
                    _PurposeRestriction_js__WEBPACK_IMPORTED_MODULE_0__.PurposeRestriction.unHash(
                      hash
                    )
                  );
                }
              } else {
                retr.push(
                  _PurposeRestriction_js__WEBPACK_IMPORTED_MODULE_0__.PurposeRestriction.unHash(
                    hash
                  )
                );
              }
            });
            return retr;
          }

          getPurposes() {
            const purposeIds = new Set();
            this.map.forEach((set, hash) => {
              purposeIds.add(
                _PurposeRestriction_js__WEBPACK_IMPORTED_MODULE_0__.PurposeRestriction.unHash(
                  hash
                ).purposeId
              );
            });
            return Array.from(purposeIds);
          }
          /**
           * remove - removes Vendor ID from a Purpose Restriction
           *
           * @param {number} vendorId
           * @param {PurposeRestriction} purposeRestriction
           * @return {void}
           */

          remove(vendorId, purposeRestriction) {
            const hash = purposeRestriction.hash;
            const set = this.map.get(hash);

            if (set) {
              set.delete(vendorId); // if it's empty let's delete the key so it doesn't show up empty

              if (set.size == 0) {
                this.map.delete(hash);
                this.bitLength = 0;
              }
            }
          }
          /**
           * Essential for being able to determine whether we can actually set a
           * purpose restriction since they have to have a flexible legal basis
           *
           * @param {GVL} value - the GVL instance
           */

          set gvl(value) {
            if (!this.gvl_) {
              this.gvl_ = value;
              /**
               * if we have restrictions set before the gvl is set then we'll have to
               * go through and remove some if they're not valid
               */

              this.map.forEach((set, hash) => {
                const purposeRestriction =
                  _PurposeRestriction_js__WEBPACK_IMPORTED_MODULE_0__.PurposeRestriction.unHash(
                    hash
                  );
                const vendors = Array.from(set);
                vendors.forEach((vendorId) => {
                  if (
                    !this.isOkToHave(
                      purposeRestriction.restrictionType,
                      purposeRestriction.purposeId,
                      vendorId
                    )
                  ) {
                    set.delete(vendorId);
                  }
                });
              });
            }
          }
          /**
           * gvl returns local copy of the GVL these restrictions apply to
           *
           * @return {GVL}
           */

          get gvl() {
            return this.gvl_;
          }
          /**
           * isEmpty - whether or not this vector has any restrictions in it
           *
           * @return {boolean}
           */

          isEmpty() {
            return this.map.size === 0;
          }
          /**
           * numRestrictions - returns the number of Purpose Restrictions.
           *
           * @return {number}
           */

          get numRestrictions() {
            return this.map.size;
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/model/RestrictionType.js":
      /*!***********************************************!*\
  !*** ./iab-tcf-core/model/RestrictionType.js ***!
  \***********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ RestrictionType: () =>
            /* binding */ RestrictionType,
          /* harmony export */
        });
        /**
         * if a Vendor has declared flexible purposes (see: [[Vendor]] under
         * `flexiblePurposeIds`) on the Global Vendor List ([[Declarations]]) a CMP may
         * change their legal basis for processing in the encoding.
         */
        var RestrictionType;

        (function (RestrictionType) {
          /**
           * under no circumstances is this purpose allowed.
           */
          RestrictionType[(RestrictionType["NOT_ALLOWED"] = 0)] = "NOT_ALLOWED";
          /**
           * if the default declaration is legitimate interest then this flips the purpose to consent in the encoding.
           */

          RestrictionType[(RestrictionType["REQUIRE_CONSENT"] = 1)] =
            "REQUIRE_CONSENT";
          /**
           * if the default declaration is consent then this flips the purpose to Legitimate Interest in the encoding.
           */

          RestrictionType[(RestrictionType["REQUIRE_LI"] = 2)] = "REQUIRE_LI";
        })(RestrictionType || (RestrictionType = {}));

        /***/
      },

    /***/ "./iab-tcf-core/model/Segment.js":
      /*!***************************************!*\
  !*** ./iab-tcf-core/model/Segment.js ***!
  \***************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Segment: () => /* binding */ Segment,
          /* harmony export */
        });
        var Segment;

        (function (Segment) {
          Segment["CORE"] = "core";
          Segment["VENDORS_DISCLOSED"] = "vendorsDisclosed";
          Segment["VENDORS_ALLOWED"] = "vendorsAllowed";
          Segment["PUBLISHER_TC"] = "publisherTC";
        })(Segment || (Segment = {}));

        /***/
      },

    /***/ "./iab-tcf-core/model/SegmentIDs.js":
      /*!******************************************!*\
  !*** ./iab-tcf-core/model/SegmentIDs.js ***!
  \******************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ SegmentIDs: () => /* binding */ SegmentIDs,
          /* harmony export */
        });
        /* harmony import */ var _Segment_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./Segment.js */ "./iab-tcf-core/model/Segment.js"
          );

        class SegmentIDs {
          /**
           * 0 = default - reserved for core string (does not need to be present in the core string)
           * 1 = OOB vendors disclosed
           * 2 = OOB vendors allowed
           * 3 = PublisherTC
           */
          static ID_TO_KEY = [
            _Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment.CORE,
            _Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment.VENDORS_DISCLOSED,
            _Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment.VENDORS_ALLOWED,
            _Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment.PUBLISHER_TC,
          ];
          static KEY_TO_ID = {
            [_Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment.CORE]: 0,
            [_Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment
              .VENDORS_DISCLOSED]: 1,
            [_Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment
              .VENDORS_ALLOWED]: 2,
            [_Segment_js__WEBPACK_IMPORTED_MODULE_0__.Segment.PUBLISHER_TC]: 3,
          };
        }

        /***/
      },

    /***/ "./iab-tcf-core/model/Vector.js":
      /*!**************************************!*\
  !*** ./iab-tcf-core/model/Vector.js ***!
  \**************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Vector: () => /* binding */ Vector,
          /* harmony export */
        });
        /* harmony import */ var _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../Cloneable.js */ "./iab-tcf-core/Cloneable.js"
          );
        /* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../errors/index.js */ "./iab-tcf-core/errors/index.js"
          );

        /**
         * Vector class is like a Set except it keeps track of a max id
         */

        class Vector extends _Cloneable_js__WEBPACK_IMPORTED_MODULE_0__.Cloneable {
          /**
           * if this originatd from an encoded string we'll need a place to store the
           * bit length; it can be set and got from here
           */
          bitLength = 0;
          maxId_ = 0;
          set_ = new Set();

          *[Symbol.iterator]() {
            for (let i = 1; i <= this.maxId; i++) {
              yield [i, this.has(i)];
            }
          }
          /**
           * values()
           *
           * @return {IterableIterator<number>} - returns an iterator of the positive
           * values in the set
           */

          values() {
            return this.set_.values();
          }
          /**
           * maxId
           *
           * @return {number} - the highest id in this Vector
           */

          get maxId() {
            return this.maxId_;
          }
          /**
           * get
           *
           * @param {number} id - key for value to check
           * @return {boolean} - value of that key, if never set it will be false
           */

          has(id) {
            /**
             * if it exists in the set we'll return true
             */
            return this.set_.has(id);
          }
          /**
           * unset
           *
           * @param {SingleIDOrCollection} id - id or ids to unset
           * @return {void}
           */

          unset(id) {
            if (Array.isArray(id)) {
              id.forEach((id) => this.unset(id));
            } else if (typeof id === "object") {
              this.unset(Object.keys(id).map((strId) => Number(strId)));
            } else {
              this.set_.delete(Number(id));
              /**
               * if bitLength was set before, it must now be unset
               */

              this.bitLength = 0;

              if (id === this.maxId) {
                /**
                 * aww bummer we lost our maxId... now we've got to search through
                 * all the ids and find the biggest one.
                 */
                this.maxId_ = 0;
                this.set_.forEach((id) => {
                  this.maxId_ = Math.max(this.maxId, id);
                });
              }
            }
          }

          isIntMap(item) {
            let result = typeof item === "object";
            result =
              result &&
              Object.keys(item).every((key) => {
                let itemResult = Number.isInteger(parseInt(key, 10));
                itemResult = itemResult && this.isValidNumber(item[key].id);
                itemResult = itemResult && item[key].name !== undefined;
                return itemResult;
              });
            return result;
          }

          isValidNumber(item) {
            return parseInt(item, 10) > 0;
          }

          isSet(item) {
            let result = false;

            if (item instanceof Set) {
              result = Array.from(item).every(this.isValidNumber);
            }

            return result;
          }
          /**
           * set - sets an item assumed to be a truthy value by its presence
           *
           * @param {SingleIDOrCollection} item - May be a single id (positive integer)
           * or collection of ids in a set, GVL Int Map, or Array.
           *
           * @return {void}
           */

          set(item) {
            /**
             * strategy here is to just recursively call set if it's a collection until
             * we get to the final integer ID
             */
            if (Array.isArray(item)) {
              item.forEach((item) => this.set(item));
            } else if (this.isSet(item)) {
              this.set(Array.from(item));
            } else if (this.isIntMap(item)) {
              this.set(Object.keys(item).map((strId) => Number(strId)));
            } else if (this.isValidNumber(item)) {
              this.set_.add(item);
              this.maxId_ = Math.max(this.maxId, item);
              /**
               * if bitLength was set before, it must now be unset
               */

              this.bitLength = 0;
            } else {
              /**
               * Super not cool to try and set something that's not valid
               */
              throw new _errors_index_js__WEBPACK_IMPORTED_MODULE_1__.TCModelError(
                "set()",
                item,
                "must be positive integer array, positive integer, Set<number>, or IntMap"
              );
            }
          }

          empty() {
            this.set_ = new Set();
          }
          /**
           * forEach - to traverse from id=1 to id=maxId in a sequential non-sparse manner
           *
           *
           * @param {forEachCallback} callback - callback to execute
           * @return {void}
           *
           * @callback forEachCallback
           * @param {boolean} value - whether or not this id exists in the vector
           * @param {number} id - the id number of the current iteration
           */

          forEach(callback) {
            for (let i = 1; i <= this.maxId; i++) {
              callback(this.has(i), i);
            }
          }

          get size() {
            return this.set_.size;
          }

          setAll(intMap) {
            this.set(intMap);
          }
        }

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/ByPurposeVendorMap.js":
      /*!******************************************************!*\
  !*** ./iab-tcf-core/model/gvl/ByPurposeVendorMap.js ***!
  \******************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/DataCategory.js":
      /*!************************************************!*\
  !*** ./iab-tcf-core/model/gvl/DataCategory.js ***!
  \************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/Declarations.js":
      /*!************************************************!*\
  !*** ./iab-tcf-core/model/gvl/Declarations.js ***!
  \************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/Feature.js":
      /*!*******************************************!*\
  !*** ./iab-tcf-core/model/gvl/Feature.js ***!
  \*******************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/GVLMapItem.js":
      /*!**********************************************!*\
  !*** ./iab-tcf-core/model/gvl/GVLMapItem.js ***!
  \**********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/GvlCreationOptions.js":
      /*!******************************************************!*\
  !*** ./iab-tcf-core/model/gvl/GvlCreationOptions.js ***!
  \******************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/IDSetMap.js":
      /*!********************************************!*\
  !*** ./iab-tcf-core/model/gvl/IDSetMap.js ***!
  \********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/Purpose.js":
      /*!*******************************************!*\
  !*** ./iab-tcf-core/model/gvl/Purpose.js ***!
  \*******************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/Stack.js":
      /*!*****************************************!*\
  !*** ./iab-tcf-core/model/gvl/Stack.js ***!
  \*****************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/Vendor.js":
      /*!******************************************!*\
  !*** ./iab-tcf-core/model/gvl/Vendor.js ***!
  \******************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/VendorList.js":
      /*!**********************************************!*\
  !*** ./iab-tcf-core/model/gvl/VendorList.js ***!
  \**********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        /***/
      },

    /***/ "./iab-tcf-core/model/gvl/index.js":
      /*!*****************************************!*\
  !*** ./iab-tcf-core/model/gvl/index.js ***!
  \*****************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _ByPurposeVendorMap_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./ByPurposeVendorMap.js */ "./iab-tcf-core/model/gvl/ByPurposeVendorMap.js"
          );
        /* harmony import */ var _Declarations_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./Declarations.js */ "./iab-tcf-core/model/gvl/Declarations.js"
          );
        /* harmony import */ var _Feature_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./Feature.js */ "./iab-tcf-core/model/gvl/Feature.js"
          );
        /* harmony import */ var _GVLMapItem_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./GVLMapItem.js */ "./iab-tcf-core/model/gvl/GVLMapItem.js"
          );
        /* harmony import */ var _IDSetMap_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./IDSetMap.js */ "./iab-tcf-core/model/gvl/IDSetMap.js"
          );
        /* harmony import */ var _Purpose_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./Purpose.js */ "./iab-tcf-core/model/gvl/Purpose.js"
          );
        /* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./Stack.js */ "./iab-tcf-core/model/gvl/Stack.js"
          );
        /* harmony import */ var _Vendor_js__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ./Vendor.js */ "./iab-tcf-core/model/gvl/Vendor.js"
          );
        /* harmony import */ var _VendorList_js__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! ./VendorList.js */ "./iab-tcf-core/model/gvl/VendorList.js"
          );
        /* harmony import */ var _DataCategory_js__WEBPACK_IMPORTED_MODULE_9__ =
          __webpack_require__(
            /*! ./DataCategory.js */ "./iab-tcf-core/model/gvl/DataCategory.js"
          );
        /* harmony import */ var _GvlCreationOptions_js__WEBPACK_IMPORTED_MODULE_10__ =
          __webpack_require__(
            /*! ./GvlCreationOptions.js */ "./iab-tcf-core/model/gvl/GvlCreationOptions.js"
          );
        // created from 'create-ts-index'

        /***/
      },

    /***/ "./iab-tcf-core/model/index.js":
      /*!*************************************!*\
  !*** ./iab-tcf-core/model/index.js ***!
  \*************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ConsentLanguages: () =>
            /* reexport safe */ _ConsentLanguages_js__WEBPACK_IMPORTED_MODULE_0__.ConsentLanguages,
          /* harmony export */ DeviceDisclosureStorageAccessType: () =>
            /* reexport safe */ _DeviceDisclosureStorageAccessType_js__WEBPACK_IMPORTED_MODULE_6__.DeviceDisclosureStorageAccessType,
          /* harmony export */ Fields: () =>
            /* reexport safe */ _Fields_js__WEBPACK_IMPORTED_MODULE_1__.Fields,
          /* harmony export */ PurposeRestriction: () =>
            /* reexport safe */ _PurposeRestriction_js__WEBPACK_IMPORTED_MODULE_4__.PurposeRestriction,
          /* harmony export */ PurposeRestrictionVector: () =>
            /* reexport safe */ _PurposeRestrictionVector_js__WEBPACK_IMPORTED_MODULE_5__.PurposeRestrictionVector,
          /* harmony export */ RestrictionType: () =>
            /* reexport safe */ _RestrictionType_js__WEBPACK_IMPORTED_MODULE_8__.RestrictionType,
          /* harmony export */ Segment: () =>
            /* reexport safe */ _Segment_js__WEBPACK_IMPORTED_MODULE_9__.Segment,
          /* harmony export */ SegmentIDs: () =>
            /* reexport safe */ _SegmentIDs_js__WEBPACK_IMPORTED_MODULE_10__.SegmentIDs,
          /* harmony export */ Vector: () =>
            /* reexport safe */ _Vector_js__WEBPACK_IMPORTED_MODULE_11__.Vector,
          /* harmony export */
        });
        /* harmony import */ var _ConsentLanguages_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./ConsentLanguages.js */ "./iab-tcf-core/model/ConsentLanguages.js"
          );
        /* harmony import */ var _Fields_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./Fields.js */ "./iab-tcf-core/model/Fields.js"
          );
        /* harmony import */ var _IntMap_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./IntMap.js */ "./iab-tcf-core/model/IntMap.js"
          );
        /* harmony import */ var _KeyMap_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./KeyMap.js */ "./iab-tcf-core/model/KeyMap.js"
          );
        /* harmony import */ var _PurposeRestriction_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./PurposeRestriction.js */ "./iab-tcf-core/model/PurposeRestriction.js"
          );
        /* harmony import */ var _PurposeRestrictionVector_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./PurposeRestrictionVector.js */ "./iab-tcf-core/model/PurposeRestrictionVector.js"
          );
        /* harmony import */ var _DeviceDisclosureStorageAccessType_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./DeviceDisclosureStorageAccessType.js */ "./iab-tcf-core/model/DeviceDisclosureStorageAccessType.js"
          );
        /* harmony import */ var _DeviceDisclosure_js__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ./DeviceDisclosure.js */ "./iab-tcf-core/model/DeviceDisclosure.js"
          );
        /* harmony import */ var _RestrictionType_js__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! ./RestrictionType.js */ "./iab-tcf-core/model/RestrictionType.js"
          );
        /* harmony import */ var _Segment_js__WEBPACK_IMPORTED_MODULE_9__ =
          __webpack_require__(
            /*! ./Segment.js */ "./iab-tcf-core/model/Segment.js"
          );
        /* harmony import */ var _SegmentIDs_js__WEBPACK_IMPORTED_MODULE_10__ =
          __webpack_require__(
            /*! ./SegmentIDs.js */ "./iab-tcf-core/model/SegmentIDs.js"
          );
        /* harmony import */ var _Vector_js__WEBPACK_IMPORTED_MODULE_11__ =
          __webpack_require__(
            /*! ./Vector.js */ "./iab-tcf-core/model/Vector.js"
          );
        /* harmony import */ var _gvl_index_js__WEBPACK_IMPORTED_MODULE_12__ =
          __webpack_require__(
            /*! ./gvl/index.js */ "./iab-tcf-core/model/gvl/index.js"
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CallResponder.js":
      /*!*********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CallResponder.js ***!
  \*********************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __read =
            (this && this.__read) ||
            function (o, n) {
              var e = "function" == typeof Symbol && o[Symbol.iterator];
              if (!e) return o;
              var s,
                a,
                i = e.call(o),
                t = [];
              try {
                for (; (void 0 === n || n-- > 0) && !(s = i.next()).done; )
                  t.push(s.value);
              } catch (o) {
                a = { error: o };
              } finally {
                try {
                  s && !s.done && (e = i.return) && e.call(i);
                } finally {
                  if (a) throw a.error;
                }
              }
              return t;
            },
          __spreadArray =
            (this && this.__spreadArray) ||
            function (o, n, e) {
              if (e || 2 === arguments.length)
                for (var s, a = 0, i = n.length; a < i; a++)
                  (!s && a in n) ||
                    (s || (s = Array.prototype.slice.call(n, 0, a)),
                    (s[a] = n[a]));
              return o.concat(s || Array.prototype.slice.call(n));
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CallResponder = exports.API_KEY = void 0);
        var index_js_1 = __webpack_require__(
            /*! ./command/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/index.js"
          ),
          CommandMap_js_1 = __webpack_require__(
            /*! ./command/CommandMap.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/CommandMap.js"
          ),
          CmpApiModel_js_1 = __webpack_require__(
            /*! ./CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          Disabled_js_1 = __webpack_require__(
            /*! ./response/Disabled.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Disabled.js"
          ),
          SupportedVersions_js_1 = __webpack_require__(
            /*! ./SupportedVersions.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/SupportedVersions.js"
          );
        exports.API_KEY = "__tcfapi";
        var CallResponder = (function () {
          function o(o) {
            if (o) {
              var n = index_js_1.TCFCommand.ADD_EVENT_LISTENER;
              if (null == o ? void 0 : o[n])
                throw new Error(
                  "Built-In Custom Commmand for "
                    .concat(n, " not allowed: Use ")
                    .concat(index_js_1.TCFCommand.GET_TC_DATA, " instead")
                );
              if (
                ((n = index_js_1.TCFCommand.REMOVE_EVENT_LISTENER),
                null == o ? void 0 : o[n])
              )
                throw new Error(
                  "Built-In Custom Commmand for ".concat(n, " not allowed")
                );
              (null == o ? void 0 : o[index_js_1.TCFCommand.GET_TC_DATA]) &&
                ((o[index_js_1.TCFCommand.ADD_EVENT_LISTENER] =
                  o[index_js_1.TCFCommand.GET_TC_DATA]),
                (o[index_js_1.TCFCommand.REMOVE_EVENT_LISTENER] =
                  o[index_js_1.TCFCommand.GET_TC_DATA])),
                (this.customCommands = o);
            }
            try {
              this.callQueue = window[exports.API_KEY]() || [];
            } catch (o) {
              this.callQueue = [];
            } finally {
              (window[exports.API_KEY] = this.apiCall.bind(this)),
                this.purgeQueuedCalls();
            }
          }
          return (
            (o.prototype.apiCall = function (o, n, e) {
              for (var s, a = [], i = 3; i < arguments.length; i++)
                a[i - 3] = arguments[i];
              if ("string" != typeof o) e(null, !1);
              else if (SupportedVersions_js_1.SupportedVersions.has(n)) {
                if ("function" != typeof e)
                  throw new Error("invalid callback function");
                CmpApiModel_js_1.CmpApiModel.disabled
                  ? e(new Disabled_js_1.Disabled(), !1)
                  : this.isCustomCommand(o) || this.isBuiltInCommand(o)
                  ? this.isCustomCommand(o) && !this.isBuiltInCommand(o)
                    ? (s = this.customCommands)[o].apply(
                        s,
                        __spreadArray([e], __read(a), !1)
                      )
                    : o === index_js_1.TCFCommand.PING
                    ? this.isCustomCommand(o)
                      ? new CommandMap_js_1.CommandMap[o](
                          this.customCommands[o],
                          a[0],
                          null,
                          e
                        )
                      : new CommandMap_js_1.CommandMap[o](e, a[0])
                    : void 0 === CmpApiModel_js_1.CmpApiModel.tcModel
                    ? this.callQueue.push(
                        __spreadArray([o, n, e], __read(a), !1)
                      )
                    : this.isCustomCommand(o) && this.isBuiltInCommand(o)
                    ? new CommandMap_js_1.CommandMap[o](
                        this.customCommands[o],
                        a[0],
                        null,
                        e
                      )
                    : new CommandMap_js_1.CommandMap[o](e, a[0])
                  : e(null, !1);
              } else e(null, !1);
            }),
            (o.prototype.purgeQueuedCalls = function () {
              var o = this.callQueue;
              (this.callQueue = []),
                o.forEach(function (o) {
                  window[exports.API_KEY].apply(
                    window,
                    __spreadArray([], __read(o), !1)
                  );
                });
            }),
            (o.prototype.isCustomCommand = function (o) {
              return (
                this.customCommands &&
                "function" == typeof this.customCommands[o]
              );
            }),
            (o.prototype.isBuiltInCommand = function (o) {
              return void 0 !== CommandMap_js_1.CommandMap[o];
            }),
            o
          );
        })();
        exports.CallResponder = CallResponder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApi.js":
      /*!**************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApi.js ***!
  \**************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CmpApi = void 0);
        var CmpApiModel_js_1 = __webpack_require__(
            /*! ./CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ./status/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/index.js"
          ),
          CallResponder_js_1 = __webpack_require__(
            /*! ./CallResponder.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CallResponder.js"
          ),
          core_1 = __webpack_require__(
            /*! @iabtechlabtcf/core */ "./node_modules/@iabtechlabtcf/core/lib/cjs/index.js"
          ),
          CmpApi = (function () {
            function p(p, e, i, o) {
              void 0 === i && (i = !1),
                (this.numUpdates = 0),
                this.throwIfInvalidInt(p, "cmpId", 2),
                this.throwIfInvalidInt(e, "cmpVersion", 0),
                (CmpApiModel_js_1.CmpApiModel.cmpId = p),
                (CmpApiModel_js_1.CmpApiModel.cmpVersion = e),
                (CmpApiModel_js_1.CmpApiModel.tcfPolicyVersion = 4),
                (this.isServiceSpecific = !!i),
                (this.callResponder = new CallResponder_js_1.CallResponder(o));
            }
            return (
              (p.prototype.throwIfInvalidInt = function (p, e, i) {
                if (!("number" == typeof p && Number.isInteger(p) && p >= i))
                  throw new Error("Invalid ".concat(e, ": ").concat(p));
              }),
              (p.prototype.update = function (p, e) {
                if (
                  (void 0 === e && (e = !1),
                  CmpApiModel_js_1.CmpApiModel.disabled)
                )
                  throw new Error("CmpApi Disabled");
                (CmpApiModel_js_1.CmpApiModel.cmpStatus =
                  index_js_1.CmpStatus.LOADED),
                  e
                    ? ((CmpApiModel_js_1.CmpApiModel.displayStatus =
                        index_js_1.DisplayStatus.VISIBLE),
                      (CmpApiModel_js_1.CmpApiModel.eventStatus =
                        index_js_1.EventStatus.CMP_UI_SHOWN))
                    : void 0 === CmpApiModel_js_1.CmpApiModel.tcModel
                    ? ((CmpApiModel_js_1.CmpApiModel.displayStatus =
                        index_js_1.DisplayStatus.DISABLED),
                      (CmpApiModel_js_1.CmpApiModel.eventStatus =
                        index_js_1.EventStatus.TC_LOADED))
                    : ((CmpApiModel_js_1.CmpApiModel.displayStatus =
                        index_js_1.DisplayStatus.HIDDEN),
                      (CmpApiModel_js_1.CmpApiModel.eventStatus =
                        index_js_1.EventStatus.USER_ACTION_COMPLETE)),
                  (CmpApiModel_js_1.CmpApiModel.gdprApplies = null !== p),
                  CmpApiModel_js_1.CmpApiModel.gdprApplies
                    ? ("" === p
                        ? ((CmpApiModel_js_1.CmpApiModel.tcModel =
                            new core_1.TCModel()),
                          (CmpApiModel_js_1.CmpApiModel.tcModel.cmpId =
                            CmpApiModel_js_1.CmpApiModel.cmpId),
                          (CmpApiModel_js_1.CmpApiModel.tcModel.cmpVersion =
                            CmpApiModel_js_1.CmpApiModel.cmpVersion))
                        : (CmpApiModel_js_1.CmpApiModel.tcModel =
                            core_1.TCString.decode(p)),
                      (CmpApiModel_js_1.CmpApiModel.tcModel.isServiceSpecific =
                        this.isServiceSpecific),
                      (CmpApiModel_js_1.CmpApiModel.tcfPolicyVersion = Number(
                        CmpApiModel_js_1.CmpApiModel.tcModel.policyVersion
                      )),
                      (CmpApiModel_js_1.CmpApiModel.tcString = p))
                    : (CmpApiModel_js_1.CmpApiModel.tcModel = null),
                  0 === this.numUpdates
                    ? this.callResponder.purgeQueuedCalls()
                    : CmpApiModel_js_1.CmpApiModel.eventQueue.exec(),
                  this.numUpdates++;
              }),
              (p.prototype.disable = function () {
                (CmpApiModel_js_1.CmpApiModel.disabled = !0),
                  (CmpApiModel_js_1.CmpApiModel.cmpStatus =
                    index_js_1.CmpStatus.ERROR);
              }),
              p
            );
          })();
        exports.CmpApi = CmpApi;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js":
      /*!*******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js ***!
  \*******************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CmpApiModel = void 0);
        var index_js_1 = __webpack_require__(
            /*! ./status/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/index.js"
          ),
          EventListenerQueue_js_1 = __webpack_require__(
            /*! ./EventListenerQueue.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/EventListenerQueue.js"
          ),
          CmpApiModel = (function () {
            function e() {}
            return (
              (e.reset = function () {
                delete this.cmpId,
                  delete this.cmpVersion,
                  delete this.eventStatus,
                  delete this.gdprApplies,
                  delete this.tcModel,
                  delete this.tcString,
                  delete this.tcfPolicyVersion,
                  (this.cmpStatus = index_js_1.CmpStatus.LOADING),
                  (this.disabled = !1),
                  (this.displayStatus = index_js_1.DisplayStatus.HIDDEN),
                  this.eventQueue.clear();
              }),
              (e.apiVersion = "2"),
              (e.eventQueue = new EventListenerQueue_js_1.EventListenerQueue()),
              (e.cmpStatus = index_js_1.CmpStatus.LOADING),
              (e.disabled = !1),
              (e.displayStatus = index_js_1.DisplayStatus.HIDDEN),
              e
            );
          })();
        exports.CmpApiModel = CmpApiModel;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CustomCommands.js":
      /*!**********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CustomCommands.js ***!
  \**********************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/EventListenerQueue.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/EventListenerQueue.js ***!
  \**************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.EventListenerQueue = void 0);
        var GetTCDataCommand_js_1 = __webpack_require__(
            /*! ./command/GetTCDataCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetTCDataCommand.js"
          ),
          EventListenerQueue = (function () {
            function e() {
              (this.eventQueue = new Map()), (this.queueNumber = 0);
            }
            return (
              (e.prototype.add = function (e) {
                return (
                  this.eventQueue.set(this.queueNumber, e), this.queueNumber++
                );
              }),
              (e.prototype.remove = function (e) {
                return this.eventQueue.delete(e);
              }),
              (e.prototype.exec = function () {
                this.eventQueue.forEach(function (e, t) {
                  new GetTCDataCommand_js_1.GetTCDataCommand(
                    e.callback,
                    e.param,
                    t,
                    e.next
                  );
                });
              }),
              (e.prototype.clear = function () {
                (this.queueNumber = 0), this.eventQueue.clear();
              }),
              Object.defineProperty(e.prototype, "size", {
                get: function () {
                  return this.eventQueue.size;
                },
                enumerable: !1,
                configurable: !0,
              }),
              e
            );
          })();
        exports.EventListenerQueue = EventListenerQueue;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/SupportedVersions.js":
      /*!*************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/SupportedVersions.js ***!
  \*************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SupportedVersions = void 0);
        var SupportedVersions = (function () {
          function e() {}
          return (
            (e.has = function (e) {
              return "string" == typeof e && (e = Number(e)), this.set_.has(e);
            }),
            (e.set_ = new Set([0, 2, void 0, null])),
            e
          );
        })();
        exports.SupportedVersions = SupportedVersions;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/AddEventListenerCommand.js":
      /*!***************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/AddEventListenerCommand.js ***!
  \***************************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var t = function (e, n) {
              return (t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                })(e, n);
            };
            return function (e, n) {
              if ("function" != typeof n && null !== n)
                throw new TypeError(
                  "Class extends value " +
                    String(n) +
                    " is not a constructor or null"
                );
              function o() {
                this.constructor = e;
              }
              t(e, n),
                (e.prototype =
                  null === n
                    ? Object.create(n)
                    : ((o.prototype = n.prototype), new o()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AddEventListenerCommand = void 0);
        var CmpApiModel_js_1 = __webpack_require__(
            /*! ../CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          GetTCDataCommand_js_1 = __webpack_require__(
            /*! ./GetTCDataCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetTCDataCommand.js"
          ),
          AddEventListenerCommand = (function (t) {
            function e() {
              return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
              __extends(e, t),
              (e.prototype.respond = function () {
                (this.listenerId = CmpApiModel_js_1.CmpApiModel.eventQueue.add({
                  callback: this.callback,
                  param: this.param,
                  next: this.next,
                })),
                  t.prototype.respond.call(this);
              }),
              e
            );
          })(GetTCDataCommand_js_1.GetTCDataCommand);
        exports.AddEventListenerCommand = AddEventListenerCommand;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/Command.js":
      /*!***********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/Command.js ***!
  \***********************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Command = void 0);
        var Command = (function () {
          function t(t, e, n, a) {
            (this.success = !0),
              Object.assign(this, {
                callback: t,
                listenerId: n,
                param: e,
                next: a,
              });
            try {
              this.respond();
            } catch (t) {
              this.invokeCallback(null);
            }
          }
          return (
            (t.prototype.invokeCallback = function (t) {
              var e = null !== t;
              "function" == typeof this.next
                ? this.callback(this.next, t, e)
                : this.callback(t, e);
            }),
            t
          );
        })();
        exports.Command = Command;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/CommandCallback.js":
      /*!*******************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/CommandCallback.js ***!
  \*******************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/CommandMap.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/CommandMap.js ***!
  \**************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CommandMap = void 0);
        var PingCommand_js_1 = __webpack_require__(
            /*! ./PingCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/PingCommand.js"
          ),
          GetTCDataCommand_js_1 = __webpack_require__(
            /*! ./GetTCDataCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetTCDataCommand.js"
          ),
          GetInAppTCDataCommand_js_1 = __webpack_require__(
            /*! ./GetInAppTCDataCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetInAppTCDataCommand.js"
          ),
          GetVendorListCommand_js_1 = __webpack_require__(
            /*! ./GetVendorListCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetVendorListCommand.js"
          ),
          AddEventListenerCommand_js_1 = __webpack_require__(
            /*! ./AddEventListenerCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/AddEventListenerCommand.js"
          ),
          RemoveEventListenerCommand_js_1 = __webpack_require__(
            /*! ./RemoveEventListenerCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/RemoveEventListenerCommand.js"
          ),
          TCFCommand_js_1 = __webpack_require__(
            /*! ./TCFCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/TCFCommand.js"
          ),
          CommandMap = (function () {
            function m() {}
            var n, e, C, a, o, d;
            return (
              (n = TCFCommand_js_1.TCFCommand.PING),
              (e = TCFCommand_js_1.TCFCommand.GET_TC_DATA),
              (C = TCFCommand_js_1.TCFCommand.GET_IN_APP_TC_DATA),
              (a = TCFCommand_js_1.TCFCommand.GET_VENDOR_LIST),
              (o = TCFCommand_js_1.TCFCommand.ADD_EVENT_LISTENER),
              (d = TCFCommand_js_1.TCFCommand.REMOVE_EVENT_LISTENER),
              (m[n] = PingCommand_js_1.PingCommand),
              (m[e] = GetTCDataCommand_js_1.GetTCDataCommand),
              (m[C] = GetInAppTCDataCommand_js_1.GetInAppTCDataCommand),
              (m[a] = GetVendorListCommand_js_1.GetVendorListCommand),
              (m[o] = AddEventListenerCommand_js_1.AddEventListenerCommand),
              (m[d] =
                RemoveEventListenerCommand_js_1.RemoveEventListenerCommand),
              m
            );
          })();
        exports.CommandMap = CommandMap;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetInAppTCDataCommand.js":
      /*!*************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetInAppTCDataCommand.js ***!
  \*************************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var t = function (n, e) {
              return (t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, n) {
                    t.__proto__ = n;
                  }) ||
                function (t, n) {
                  for (var e in n)
                    Object.prototype.hasOwnProperty.call(n, e) && (t[e] = n[e]);
                })(n, e);
            };
            return function (n, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Class extends value " +
                    String(e) +
                    " is not a constructor or null"
                );
              function o() {
                this.constructor = n;
              }
              t(n, e),
                (n.prototype =
                  null === e
                    ? Object.create(e)
                    : ((o.prototype = e.prototype), new o()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.GetInAppTCDataCommand = void 0);
        var GetTCDataCommand_js_1 = __webpack_require__(
            /*! ./GetTCDataCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetTCDataCommand.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../response/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/index.js"
          ),
          GetInAppTCDataCommand = (function (t) {
            function n() {
              return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
              __extends(n, t),
              (n.prototype.respond = function () {
                this.throwIfParamInvalid(),
                  this.invokeCallback(new index_js_1.InAppTCData(this.param));
              }),
              n
            );
          })(GetTCDataCommand_js_1.GetTCDataCommand);
        exports.GetInAppTCDataCommand = GetInAppTCDataCommand;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetTCDataCommand.js":
      /*!********************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetTCDataCommand.js ***!
  \********************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var t = function (r, e) {
              return (t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, r) {
                    t.__proto__ = r;
                  }) ||
                function (t, r) {
                  for (var e in r)
                    Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
                })(r, e);
            };
            return function (r, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Class extends value " +
                    String(e) +
                    " is not a constructor or null"
                );
              function n() {
                this.constructor = r;
              }
              t(r, e),
                (r.prototype =
                  null === e
                    ? Object.create(e)
                    : ((n.prototype = e.prototype), new n()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.GetTCDataCommand = void 0);
        var Command_js_1 = __webpack_require__(
            /*! ./Command.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/Command.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../response/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/index.js"
          ),
          GetTCDataCommand = (function (t) {
            function r() {
              return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
              __extends(r, t),
              (r.prototype.respond = function () {
                this.throwIfParamInvalid(),
                  this.invokeCallback(
                    new index_js_1.TCData(this.param, this.listenerId)
                  );
              }),
              (r.prototype.throwIfParamInvalid = function () {
                if (
                  !(
                    void 0 === this.param ||
                    (Array.isArray(this.param) &&
                      this.param.every(Number.isInteger))
                  )
                )
                  throw new Error("Invalid Parameter");
              }),
              r
            );
          })(Command_js_1.Command);
        exports.GetTCDataCommand = GetTCDataCommand;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetVendorListCommand.js":
      /*!************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/GetVendorListCommand.js ***!
  \************************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var t = function (e, o) {
              return (t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var o in e)
                    Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                })(e, o);
            };
            return function (e, o) {
              if ("function" != typeof o && null !== o)
                throw new TypeError(
                  "Class extends value " +
                    String(o) +
                    " is not a constructor or null"
                );
              function r() {
                this.constructor = e;
              }
              t(e, o),
                (e.prototype =
                  null === o
                    ? Object.create(o)
                    : ((r.prototype = o.prototype), new r()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.GetVendorListCommand = void 0);
        var CmpApiModel_js_1 = __webpack_require__(
            /*! ../CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          Command_js_1 = __webpack_require__(
            /*! ./Command.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/Command.js"
          ),
          core_1 = __webpack_require__(
            /*! @iabtechlabtcf/core */ "./node_modules/@iabtechlabtcf/core/lib/cjs/index.js"
          ),
          GetVendorListCommand = (function (t) {
            function e() {
              return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
              __extends(e, t),
              (e.prototype.respond = function () {
                var t,
                  e = this,
                  o = CmpApiModel_js_1.CmpApiModel.tcModel,
                  r = o.vendorListVersion;
                void 0 === this.param && (this.param = r),
                  (t =
                    this.param === r && o.gvl
                      ? o.gvl
                      : new core_1.GVL(this.param)).readyPromise.then(
                    function () {
                      e.invokeCallback(t.getJson());
                    }
                  );
              }),
              e
            );
          })(Command_js_1.Command);
        exports.GetVendorListCommand = GetVendorListCommand;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/PingCommand.js":
      /*!***************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/PingCommand.js ***!
  \***************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var n = function (t, o) {
              return (n =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (n, t) {
                    n.__proto__ = t;
                  }) ||
                function (n, t) {
                  for (var o in t)
                    Object.prototype.hasOwnProperty.call(t, o) && (n[o] = t[o]);
                })(t, o);
            };
            return function (t, o) {
              if ("function" != typeof o && null !== o)
                throw new TypeError(
                  "Class extends value " +
                    String(o) +
                    " is not a constructor or null"
                );
              function e() {
                this.constructor = t;
              }
              n(t, o),
                (t.prototype =
                  null === o
                    ? Object.create(o)
                    : ((e.prototype = o.prototype), new e()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PingCommand = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../response/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/index.js"
          ),
          Command_js_1 = __webpack_require__(
            /*! ./Command.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/Command.js"
          ),
          PingCommand = (function (n) {
            function t() {
              return (null !== n && n.apply(this, arguments)) || this;
            }
            return (
              __extends(t, n),
              (t.prototype.respond = function () {
                this.invokeCallback(new index_js_1.Ping());
              }),
              t
            );
          })(Command_js_1.Command);
        exports.PingCommand = PingCommand;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/RemoveEventListenerCommand.js":
      /*!******************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/RemoveEventListenerCommand.js ***!
  \******************************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var e = function (t, o) {
              return (e =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, t) {
                    e.__proto__ = t;
                  }) ||
                function (e, t) {
                  for (var o in t)
                    Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
                })(t, o);
            };
            return function (t, o) {
              if ("function" != typeof o && null !== o)
                throw new TypeError(
                  "Class extends value " +
                    String(o) +
                    " is not a constructor or null"
                );
              function n() {
                this.constructor = t;
              }
              e(t, o),
                (t.prototype =
                  null === o
                    ? Object.create(o)
                    : ((n.prototype = o.prototype), new n()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.RemoveEventListenerCommand = void 0);
        var CmpApiModel_js_1 = __webpack_require__(
            /*! ../CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          Command_js_1 = __webpack_require__(
            /*! ./Command.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/Command.js"
          ),
          RemoveEventListenerCommand = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              __extends(t, e),
              (t.prototype.respond = function () {
                this.invokeCallback(
                  CmpApiModel_js_1.CmpApiModel.eventQueue.remove(this.param)
                );
              }),
              t
            );
          })(Command_js_1.Command);
        exports.RemoveEventListenerCommand = RemoveEventListenerCommand;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/TCFCommand.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/TCFCommand.js ***!
  \**************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var TCFCommand;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TCFCommand = void 0),
          (function (e) {
            (e.PING = "ping"),
              (e.GET_TC_DATA = "getTCData"),
              (e.GET_IN_APP_TC_DATA = "getInAppTCData"),
              (e.GET_VENDOR_LIST = "getVendorList"),
              (e.ADD_EVENT_LISTENER = "addEventListener"),
              (e.REMOVE_EVENT_LISTENER = "removeEventListener");
          })((TCFCommand = exports.TCFCommand || (exports.TCFCommand = {})));

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/index.js":
      /*!*********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/index.js ***!
  \*********************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, i) {
                  void 0 === i && (i = r);
                  var o = Object.getOwnPropertyDescriptor(t, r);
                  (o &&
                    !("get" in o
                      ? !t.__esModule
                      : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    }),
                    Object.defineProperty(e, i, o);
                }
              : function (e, t, r, i) {
                  void 0 === i && (i = r), (e[i] = t[r]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  __createBinding(t, e, r);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./TCFCommand.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/TCFCommand.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./CommandCallback.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/CommandCallback.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/index.js":
      /*!*************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/index.js ***!
  \*************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, r, t, o) {
                  void 0 === o && (o = t);
                  var i = Object.getOwnPropertyDescriptor(r, t);
                  (i &&
                    !("get" in i
                      ? !r.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return r[t];
                      },
                    }),
                    Object.defineProperty(e, o, i);
                }
              : function (e, r, t, o) {
                  void 0 === o && (o = t), (e[o] = r[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, r) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(r, t) ||
                  __createBinding(r, e, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.API_KEY = void 0),
          __exportStar(
            __webpack_require__(
              /*! ./command/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/command/index.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./response/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/index.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./status/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/index.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./CmpApi.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApi.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./CustomCommands.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CustomCommands.js"
            ),
            exports
          );
        var CallResponder_js_1 = __webpack_require__(
          /*! ./CallResponder.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CallResponder.js"
        );
        Object.defineProperty(exports, "API_KEY", {
          enumerable: !0,
          get: function () {
            return CallResponder_js_1.API_KEY;
          },
        });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Disabled.js":
      /*!*************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Disabled.js ***!
  \*************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var t = function (e, n) {
              return (t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                })(e, n);
            };
            return function (e, n) {
              if ("function" != typeof n && null !== n)
                throw new TypeError(
                  "Class extends value " +
                    String(n) +
                    " is not a constructor or null"
                );
              function r() {
                this.constructor = e;
              }
              t(e, n),
                (e.prototype =
                  null === n
                    ? Object.create(n)
                    : ((r.prototype = n.prototype), new r()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Disabled = void 0);
        var Response_js_1 = __webpack_require__(
            /*! ./Response.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Response.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../status/index.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/index.js"
          ),
          Disabled = (function (t) {
            function e() {
              var e = (null !== t && t.apply(this, arguments)) || this;
              return (e.cmpStatus = index_js_1.CmpStatus.ERROR), e;
            }
            return __extends(e, t), e;
          })(Response_js_1.Response);
        exports.Disabled = Disabled;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/InAppTCData.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/InAppTCData.js ***!
  \****************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
            (this && this.__extends) ||
            (function () {
              var t = function (r, e) {
                return (t =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, r) {
                      t.__proto__ = r;
                    }) ||
                  function (t, r) {
                    for (var e in r)
                      Object.prototype.hasOwnProperty.call(r, e) &&
                        (t[e] = r[e]);
                  })(r, e);
              };
              return function (r, e) {
                if ("function" != typeof e && null !== e)
                  throw new TypeError(
                    "Class extends value " +
                      String(e) +
                      " is not a constructor or null"
                  );
                function n() {
                  this.constructor = r;
                }
                t(r, e),
                  (r.prototype =
                    null === e
                      ? Object.create(e)
                      : ((n.prototype = e.prototype), new n()));
              };
            })(),
          __read =
            (this && this.__read) ||
            function (t, r) {
              var e = "function" == typeof Symbol && t[Symbol.iterator];
              if (!e) return t;
              var n,
                o,
                a = e.call(t),
                i = [];
              try {
                for (; (void 0 === r || r-- > 0) && !(n = a.next()).done; )
                  i.push(n.value);
              } catch (t) {
                o = { error: t };
              } finally {
                try {
                  n && !n.done && (e = a.return) && e.call(a);
                } finally {
                  if (o) throw o.error;
                }
              }
              return i;
            },
          __spreadArray =
            (this && this.__spreadArray) ||
            function (t, r, e) {
              if (e || 2 === arguments.length)
                for (var n, o = 0, a = r.length; o < a; o++)
                  (!n && o in r) ||
                    (n || (n = Array.prototype.slice.call(r, 0, o)),
                    (n[o] = r[o]));
              return t.concat(n || Array.prototype.slice.call(r));
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.InAppTCData = void 0);
        var TCData_js_1 = __webpack_require__(
            /*! ./TCData.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/TCData.js"
          ),
          InAppTCData = (function (t) {
            function r(r) {
              var e = t.call(this, r) || this;
              return delete e.outOfBand, e;
            }
            return (
              __extends(r, t),
              (r.prototype.createVectorField = function (t) {
                return __spreadArray([], __read(t), !1).reduce(function (t, r) {
                  return (t += r[1] ? "1" : "0");
                }, "");
              }),
              (r.prototype.createRestrictions = function (t) {
                var r = {};
                if (t.numRestrictions > 0) {
                  var e = t.getMaxVendorId();
                  t.getRestrictions().forEach(function (t) {
                    r[t.purposeId.toString()] = "_".repeat(e);
                  });
                  for (
                    var n = function (e) {
                        var n = e + 1;
                        t.getRestrictions(n).forEach(function (t) {
                          var n = t.restrictionType.toString(),
                            o = t.purposeId.toString(),
                            a = r[o].substr(0, e),
                            i = r[o].substr(e + 1);
                          r[o] = a + n + i;
                        });
                      },
                      o = 0;
                    o < e;
                    o++
                  )
                    n(o);
                }
                return r;
              }),
              r
            );
          })(TCData_js_1.TCData);
        exports.InAppTCData = InAppTCData;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Ping.js":
      /*!*********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Ping.js ***!
  \*********************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var e = function (o, t) {
              return (e =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, o) {
                    e.__proto__ = o;
                  }) ||
                function (e, o) {
                  for (var t in o)
                    Object.prototype.hasOwnProperty.call(o, t) && (e[t] = o[t]);
                })(o, t);
            };
            return function (o, t) {
              if ("function" != typeof t && null !== t)
                throw new TypeError(
                  "Class extends value " +
                    String(t) +
                    " is not a constructor or null"
                );
              function p() {
                this.constructor = o;
              }
              e(o, t),
                (o.prototype =
                  null === t
                    ? Object.create(t)
                    : ((p.prototype = t.prototype), new p()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Ping = void 0);
        var CmpApiModel_js_1 = __webpack_require__(
            /*! ../CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          Response_js_1 = __webpack_require__(
            /*! ./Response.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Response.js"
          ),
          Ping = (function (e) {
            function o() {
              var o = e.call(this) || this;
              return (
                (o.cmpLoaded = !0),
                (o.cmpStatus = CmpApiModel_js_1.CmpApiModel.cmpStatus),
                (o.displayStatus = CmpApiModel_js_1.CmpApiModel.displayStatus),
                (o.apiVersion = String(
                  CmpApiModel_js_1.CmpApiModel.apiVersion
                )),
                CmpApiModel_js_1.CmpApiModel.tcModel &&
                  CmpApiModel_js_1.CmpApiModel.tcModel.vendorListVersion &&
                  (o.gvlVersion =
                    +CmpApiModel_js_1.CmpApiModel.tcModel.vendorListVersion),
                o
              );
            }
            return __extends(o, e), o;
          })(Response_js_1.Response);
        exports.Ping = Ping;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Response.js":
      /*!*************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Response.js ***!
  \*************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Response = void 0);
        var CmpApiModel_js_1 = __webpack_require__(
            /*! ../CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          Response = function () {
            (this.cmpId = CmpApiModel_js_1.CmpApiModel.cmpId),
              (this.cmpVersion = CmpApiModel_js_1.CmpApiModel.cmpVersion),
              (this.gdprApplies = CmpApiModel_js_1.CmpApiModel.gdprApplies),
              (this.tcfPolicyVersion =
                CmpApiModel_js_1.CmpApiModel.tcfPolicyVersion);
          };
        exports.Response = Response;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/TCData.js":
      /*!***********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/TCData.js ***!
  \***********************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
            (this && this.__extends) ||
            (function () {
              var e = function (t, r) {
                return (e =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var r in t)
                      Object.prototype.hasOwnProperty.call(t, r) &&
                        (e[r] = t[r]);
                  })(t, r);
              };
              return function (t, r) {
                if ("function" != typeof r && null !== r)
                  throw new TypeError(
                    "Class extends value " +
                      String(r) +
                      " is not a constructor or null"
                  );
                function o() {
                  this.constructor = t;
                }
                e(t, r),
                  (t.prototype =
                    null === r
                      ? Object.create(r)
                      : ((o.prototype = r.prototype), new o()));
              };
            })(),
          __read =
            (this && this.__read) ||
            function (e, t) {
              var r = "function" == typeof Symbol && e[Symbol.iterator];
              if (!r) return e;
              var o,
                n,
                s = r.call(e),
                i = [];
              try {
                for (; (void 0 === t || t-- > 0) && !(o = s.next()).done; )
                  i.push(o.value);
              } catch (e) {
                n = { error: e };
              } finally {
                try {
                  o && !o.done && (r = s.return) && r.call(s);
                } finally {
                  if (n) throw n.error;
                }
              }
              return i;
            },
          __spreadArray =
            (this && this.__spreadArray) ||
            function (e, t, r) {
              if (r || 2 === arguments.length)
                for (var o, n = 0, s = t.length; n < s; n++)
                  (!o && n in t) ||
                    (o || (o = Array.prototype.slice.call(t, 0, n)),
                    (o[n] = t[n]));
              return e.concat(o || Array.prototype.slice.call(t));
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TCData = void 0);
        var CmpApiModel_js_1 = __webpack_require__(
            /*! ../CmpApiModel.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/CmpApiModel.js"
          ),
          Response_js_1 = __webpack_require__(
            /*! ./Response.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Response.js"
          ),
          TCData = (function (e) {
            function t(t, r) {
              var o = e.call(this) || this;
              if (
                ((o.eventStatus = CmpApiModel_js_1.CmpApiModel.eventStatus),
                (o.cmpStatus = CmpApiModel_js_1.CmpApiModel.cmpStatus),
                (o.listenerId = r),
                CmpApiModel_js_1.CmpApiModel.gdprApplies)
              ) {
                var n = CmpApiModel_js_1.CmpApiModel.tcModel;
                (o.tcString = CmpApiModel_js_1.CmpApiModel.tcString),
                  (o.isServiceSpecific = n.isServiceSpecific),
                  (o.useNonStandardTexts = n.useNonStandardTexts),
                  (o.purposeOneTreatment = n.purposeOneTreatment),
                  (o.publisherCC = n.publisherCountryCode),
                  (o.outOfBand = {
                    allowedVendors: o.createVectorField(n.vendorsAllowed, t),
                    disclosedVendors: o.createVectorField(
                      n.vendorsDisclosed,
                      t
                    ),
                  }),
                  (o.purpose = {
                    consents: o.createVectorField(n.purposeConsents),
                    legitimateInterests: o.createVectorField(
                      n.purposeLegitimateInterests
                    ),
                  }),
                  (o.vendor = {
                    consents: o.createVectorField(n.vendorConsents, t),
                    legitimateInterests: o.createVectorField(
                      n.vendorLegitimateInterests,
                      t
                    ),
                  }),
                  (o.specialFeatureOptins = o.createVectorField(
                    n.specialFeatureOptins
                  )),
                  (o.publisher = {
                    consents: o.createVectorField(n.publisherConsents),
                    legitimateInterests: o.createVectorField(
                      n.publisherLegitimateInterests
                    ),
                    customPurpose: {
                      consents: o.createVectorField(n.publisherCustomConsents),
                      legitimateInterests: o.createVectorField(
                        n.publisherCustomLegitimateInterests
                      ),
                    },
                    restrictions: o.createRestrictions(n.publisherRestrictions),
                  });
              }
              return o;
            }
            return (
              __extends(t, e),
              (t.prototype.createRestrictions = function (e) {
                var t = {};
                if (e.numRestrictions > 0)
                  for (
                    var r = e.getMaxVendorId(),
                      o = function (r) {
                        var o = r.toString();
                        e.getRestrictions(r).forEach(function (e) {
                          var r = e.purposeId.toString();
                          t[r] || (t[r] = {}), (t[r][o] = e.restrictionType);
                        });
                      },
                      n = 1;
                    n <= r;
                    n++
                  )
                    o(n);
                return t;
              }),
              (t.prototype.createVectorField = function (e, t) {
                return t
                  ? t.reduce(function (t, r) {
                      return (t[String(r)] = e.has(Number(r))), t;
                    }, {})
                  : __spreadArray([], __read(e), !1).reduce(function (e, t) {
                      return (e[t[0].toString(10)] = t[1]), e;
                    }, {});
              }),
              t
            );
          })(Response_js_1.Response);
        exports.TCData = TCData;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/index.js":
      /*!**********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/index.js ***!
  \**********************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, r, t, i) {
                  void 0 === i && (i = t);
                  var o = Object.getOwnPropertyDescriptor(r, t);
                  (o &&
                    !("get" in o
                      ? !r.__esModule
                      : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return r[t];
                      },
                    }),
                    Object.defineProperty(e, i, o);
                }
              : function (e, r, t, i) {
                  void 0 === i && (i = t), (e[i] = r[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, r) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(r, t) ||
                  __createBinding(r, e, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./Disabled.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Disabled.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./InAppTCData.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/InAppTCData.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Ping.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Ping.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Response.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/Response.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./TCData.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/response/TCData.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/CmpStatus.js":
      /*!************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/CmpStatus.js ***!
  \************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var CmpStatus;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CmpStatus = void 0),
          (function (t) {
            (t.STUB = "stub"),
              (t.LOADING = "loading"),
              (t.LOADED = "loaded"),
              (t.ERROR = "error");
          })((CmpStatus = exports.CmpStatus || (exports.CmpStatus = {})));

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/DisplayStatus.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/DisplayStatus.js ***!
  \****************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var DisplayStatus;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DisplayStatus = void 0),
          (function (s) {
            (s.VISIBLE = "visible"),
              (s.HIDDEN = "hidden"),
              (s.DISABLED = "disabled");
          })(
            (DisplayStatus =
              exports.DisplayStatus || (exports.DisplayStatus = {}))
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/EventStatus.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/EventStatus.js ***!
  \**************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var EventStatus;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.EventStatus = void 0),
          (function (t) {
            (t.TC_LOADED = "tcloaded"),
              (t.CMP_UI_SHOWN = "cmpuishown"),
              (t.USER_ACTION_COMPLETE = "useractioncomplete");
          })((EventStatus = exports.EventStatus || (exports.EventStatus = {})));

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/index.js":
      /*!********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/index.js ***!
  \********************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, i) {
                  void 0 === i && (i = r);
                  var o = Object.getOwnPropertyDescriptor(t, r);
                  (o &&
                    !("get" in o
                      ? !t.__esModule
                      : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    }),
                    Object.defineProperty(e, i, o);
                }
              : function (e, t, r, i) {
                  void 0 === i && (i = r), (e[i] = t[r]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  __createBinding(t, e, r);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./CmpStatus.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/CmpStatus.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./DisplayStatus.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/DisplayStatus.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./EventStatus.js */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/status/EventStatus.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js":
      /*!***************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js ***!
  \***************************************************************/
      /***/ function (__unused_webpack_module, exports) {
        "use strict";
        var __values =
          (this && this.__values) ||
          function (e) {
            var r = "function" == typeof Symbol && Symbol.iterator,
              t = r && e[r],
              n = 0;
            if (t) return t.call(e);
            if (e && "number" == typeof e.length)
              return {
                next: function () {
                  return (
                    e && n >= e.length && (e = void 0),
                    { value: e && e[n++], done: !e }
                  );
                },
              };
            throw new TypeError(
              r ? "Object is not iterable." : "Symbol.iterator is not defined."
            );
          };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Cloneable = void 0);
        var Cloneable = (function () {
          function e() {}
          return (
            (e.prototype.clone = function () {
              var e = this,
                r = new this.constructor();
              return (
                Object.keys(this).forEach(function (t) {
                  var n = e.deepClone(e[t]);
                  void 0 !== n && (r[t] = n);
                }),
                r
              );
            }),
            (e.prototype.deepClone = function (e) {
              var r,
                t,
                n = typeof e;
              if ("number" === n || "string" === n || "boolean" === n) return e;
              if (null !== e && "object" === n) {
                if ("function" == typeof e.clone) return e.clone();
                if (e instanceof Date) return new Date(e.getTime());
                if (void 0 !== e[Symbol.iterator]) {
                  var o = [];
                  try {
                    for (
                      var i = __values(e), l = i.next();
                      !l.done;
                      l = i.next()
                    ) {
                      var a = l.value;
                      o.push(this.deepClone(a));
                    }
                  } catch (e) {
                    r = { error: e };
                  } finally {
                    try {
                      l && !l.done && (t = i.return) && t.call(i);
                    } finally {
                      if (r) throw r.error;
                    }
                  }
                  return e instanceof Array ? o : new e.constructor(o);
                }
                var u = {};
                for (var f in e)
                  e.hasOwnProperty(f) && (u[f] = this.deepClone(e[f]));
                return u;
              }
            }),
            e
          );
        })();
        exports.Cloneable = Cloneable;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/GVL.js":
      /*!*********************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/GVL.js ***!
  \*********************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
            (this && this.__extends) ||
            (function () {
              var e = function (t, r) {
                return (e =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var r in t)
                      Object.prototype.hasOwnProperty.call(t, r) &&
                        (e[r] = t[r]);
                  })(t, r);
              };
              return function (t, r) {
                if ("function" != typeof r && null !== r)
                  throw new TypeError(
                    "Class extends value " +
                      String(r) +
                      " is not a constructor or null"
                  );
                function n() {
                  this.constructor = t;
                }
                e(t, r),
                  (t.prototype =
                    null === r
                      ? Object.create(r)
                      : ((n.prototype = r.prototype), new n()));
              };
            })(),
          __assign =
            (this && this.__assign) ||
            function () {
              return (__assign =
                Object.assign ||
                function (e) {
                  for (var t, r = 1, n = arguments.length; r < n; r++)
                    for (var s in (t = arguments[r]))
                      Object.prototype.hasOwnProperty.call(t, s) &&
                        (e[s] = t[s]);
                  return e;
                }).apply(this, arguments);
            },
          __awaiter =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (s, o) {
                function i(e) {
                  try {
                    l(n.next(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function a(e) {
                  try {
                    l(n.throw(e));
                  } catch (e) {
                    o(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? s(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(i, a);
                }
                l((n = n.apply(e, t || [])).next());
              });
            },
          __generator =
            (this && this.__generator) ||
            function (e, t) {
              var r,
                n,
                s,
                o,
                i = {
                  label: 0,
                  sent: function () {
                    if (1 & s[0]) throw s[1];
                    return s[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(a) {
                return function (l) {
                  return (function (a) {
                    if (r)
                      throw new TypeError("Generator is already executing.");
                    for (; o && ((o = 0), a[0] && (i = 0)), i; )
                      try {
                        if (
                          ((r = 1),
                          n &&
                            (s =
                              2 & a[0]
                                ? n.return
                                : a[0]
                                ? n.throw || ((s = n.return) && s.call(n), 0)
                                : n.next) &&
                            !(s = s.call(n, a[1])).done)
                        )
                          return s;
                        switch (
                          ((n = 0), s && (a = [2 & a[0], s.value]), a[0])
                        ) {
                          case 0:
                          case 1:
                            s = a;
                            break;
                          case 4:
                            return i.label++, { value: a[1], done: !1 };
                          case 5:
                            i.label++, (n = a[1]), (a = [0]);
                            continue;
                          case 7:
                            (a = i.ops.pop()), i.trys.pop();
                            continue;
                          default:
                            if (
                              !((s = i.trys),
                              (s = s.length > 0 && s[s.length - 1]) ||
                                (6 !== a[0] && 2 !== a[0]))
                            ) {
                              i = 0;
                              continue;
                            }
                            if (
                              3 === a[0] &&
                              (!s || (a[1] > s[0] && a[1] < s[3]))
                            ) {
                              i.label = a[1];
                              break;
                            }
                            if (6 === a[0] && i.label < s[1]) {
                              (i.label = s[1]), (s = a);
                              break;
                            }
                            if (s && i.label < s[2]) {
                              (i.label = s[2]), i.ops.push(a);
                              break;
                            }
                            s[2] && i.ops.pop(), i.trys.pop();
                            continue;
                        }
                        a = t.call(e, i);
                      } catch (e) {
                        (a = [6, e]), (n = 0);
                      } finally {
                        r = s = 0;
                      }
                    if (5 & a[0]) throw a[1];
                    return { value: a[0] ? a[1] : void 0, done: !0 };
                  })([a, l]);
                };
              }
            },
          __values =
            (this && this.__values) ||
            function (e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                r = t && e[t],
                n = 0;
              if (r) return r.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && n >= e.length && (e = void 0),
                      { value: e && e[n++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.GVL = void 0);
        var Cloneable_js_1 = __webpack_require__(
            /*! ./Cloneable.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ./errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          Json_js_1 = __webpack_require__(
            /*! ./Json.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Json.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ./model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          GVL = (function (e) {
            function t(r, n) {
              var s = e.call(this) || this;
              (s.isReady_ = !1), (s.isLatest = !1);
              var o = t.baseUrl,
                i = null == n ? void 0 : n.language;
              if (i)
                try {
                  i = t.consentLanguages.parseLanguage(i);
                } catch (e) {
                  throw new index_js_1.GVLError(
                    "Error during parsing the language: " + e.message
                  );
                }
              if (
                ((s.lang_ = i || t.DEFAULT_LANGUAGE),
                (s.cacheLang_ = i || t.DEFAULT_LANGUAGE),
                s.isVendorList(r))
              )
                s.populate(r), (s.readyPromise = Promise.resolve());
              else {
                if (!o)
                  throw new index_js_1.GVLError(
                    "must specify GVL.baseUrl before loading GVL json"
                  );
                if (r > 0) {
                  var a = r;
                  t.CACHE.has(a)
                    ? (s.populate(t.CACHE.get(a)),
                      (s.readyPromise = Promise.resolve()))
                    : ((o += t.versionedFilename.replace(
                        "[VERSION]",
                        String(a)
                      )),
                      (s.readyPromise = s.fetchJson(o)));
                } else
                  t.CACHE.has(t.LATEST_CACHE_KEY)
                    ? (s.populate(t.CACHE.get(t.LATEST_CACHE_KEY)),
                      (s.readyPromise = Promise.resolve()))
                    : ((s.isLatest = !0),
                      (s.readyPromise = s.fetchJson(o + t.latestFilename)));
              }
              return s;
            }
            return (
              __extends(t, e),
              Object.defineProperty(t, "baseUrl", {
                get: function () {
                  return this.baseUrl_;
                },
                set: function (e) {
                  if (/^https?:\/\/vendorlist\.consensu\.org\//.test(e))
                    throw new index_js_1.GVLError(
                      "Invalid baseUrl!  You may not pull directly from vendorlist.consensu.org and must provide your own cache"
                    );
                  e.length > 0 && "/" !== e[e.length - 1] && (e += "/"),
                    (this.baseUrl_ = e);
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.emptyLanguageCache = function (e) {
                var r = !1;
                return (
                  null == e && t.LANGUAGE_CACHE.size > 0
                    ? ((t.LANGUAGE_CACHE = new Map()), (r = !0))
                    : "string" == typeof e &&
                      this.consentLanguages.has(e.toUpperCase()) &&
                      (t.LANGUAGE_CACHE.delete(e.toUpperCase()), (r = !0)),
                  r
                );
              }),
              (t.emptyCache = function (e) {
                var r = !1;
                return (
                  Number.isInteger(e) && e >= 0
                    ? (t.CACHE.delete(e), (r = !0))
                    : void 0 === e && ((t.CACHE = new Map()), (r = !0)),
                  r
                );
              }),
              (t.prototype.cacheLanguage = function () {
                t.LANGUAGE_CACHE.has(this.cacheLang_) ||
                  t.LANGUAGE_CACHE.set(this.cacheLang_, {
                    purposes: this.purposes,
                    specialPurposes: this.specialPurposes,
                    features: this.features,
                    specialFeatures: this.specialFeatures,
                    stacks: this.stacks,
                    dataCategories: this.dataCategories,
                  });
              }),
              (t.prototype.fetchJson = function (e) {
                return __awaiter(this, void 0, void 0, function () {
                  var t, r;
                  return __generator(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return (
                          n.trys.push([0, 2, , 3]),
                          (t = this.populate),
                          [4, Json_js_1.Json.fetch(e)]
                        );
                      case 1:
                        return t.apply(this, [n.sent()]), [3, 3];
                      case 2:
                        throw (
                          ((r = n.sent()), new index_js_1.GVLError(r.message))
                        );
                      case 3:
                        return [2];
                    }
                  });
                });
              }),
              (t.prototype.getJson = function () {
                return __assign(
                  __assign(
                    {
                      gvlSpecificationVersion: this.gvlSpecificationVersion,
                      vendorListVersion: this.vendorListVersion,
                      tcfPolicyVersion: this.tcfPolicyVersion,
                      lastUpdated: this.lastUpdated,
                      purposes: this.clonePurposes(),
                      specialPurposes: this.cloneSpecialPurposes(),
                      features: this.cloneFeatures(),
                      specialFeatures: this.cloneSpecialFeatures(),
                      stacks: this.cloneStacks(),
                    },
                    this.dataCategories
                      ? { dataCategories: this.cloneDataCategories() }
                      : {}
                  ),
                  { vendors: this.cloneVendors() }
                );
              }),
              (t.prototype.cloneSpecialFeatures = function () {
                var e,
                  r,
                  n = {};
                try {
                  for (
                    var s = __values(Object.keys(this.specialFeatures)),
                      o = s.next();
                    !o.done;
                    o = s.next()
                  ) {
                    var i = o.value;
                    n[i] = t.cloneFeature(this.specialFeatures[i]);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (r = s.return) && r.call(s);
                  } finally {
                    if (e) throw e.error;
                  }
                }
                return n;
              }),
              (t.prototype.cloneFeatures = function () {
                var e,
                  r,
                  n = {};
                try {
                  for (
                    var s = __values(Object.keys(this.features)), o = s.next();
                    !o.done;
                    o = s.next()
                  ) {
                    var i = o.value;
                    n[i] = t.cloneFeature(this.features[i]);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (r = s.return) && r.call(s);
                  } finally {
                    if (e) throw e.error;
                  }
                }
                return n;
              }),
              (t.prototype.cloneStacks = function () {
                var e,
                  r,
                  n = {};
                try {
                  for (
                    var s = __values(Object.keys(this.stacks)), o = s.next();
                    !o.done;
                    o = s.next()
                  ) {
                    var i = o.value;
                    n[i] = t.cloneStack(this.stacks[i]);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (r = s.return) && r.call(s);
                  } finally {
                    if (e) throw e.error;
                  }
                }
                return n;
              }),
              (t.prototype.cloneDataCategories = function () {
                var e,
                  r,
                  n = {};
                try {
                  for (
                    var s = __values(Object.keys(this.dataCategories)),
                      o = s.next();
                    !o.done;
                    o = s.next()
                  ) {
                    var i = o.value;
                    n[i] = t.cloneDataCategory(this.dataCategories[i]);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (r = s.return) && r.call(s);
                  } finally {
                    if (e) throw e.error;
                  }
                }
                return n;
              }),
              (t.prototype.cloneSpecialPurposes = function () {
                var e,
                  r,
                  n = {};
                try {
                  for (
                    var s = __values(Object.keys(this.specialPurposes)),
                      o = s.next();
                    !o.done;
                    o = s.next()
                  ) {
                    var i = o.value;
                    n[i] = t.clonePurpose(this.specialPurposes[i]);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (r = s.return) && r.call(s);
                  } finally {
                    if (e) throw e.error;
                  }
                }
                return n;
              }),
              (t.prototype.clonePurposes = function () {
                var e,
                  r,
                  n = {};
                try {
                  for (
                    var s = __values(Object.keys(this.purposes)), o = s.next();
                    !o.done;
                    o = s.next()
                  ) {
                    var i = o.value;
                    n[i] = t.clonePurpose(this.purposes[i]);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (r = s.return) && r.call(s);
                  } finally {
                    if (e) throw e.error;
                  }
                }
                return n;
              }),
              (t.clonePurpose = function (e) {
                return __assign(
                  __assign(
                    { id: e.id, name: e.name, description: e.description },
                    e.descriptionLegal
                      ? { descriptionLegal: e.descriptionLegal }
                      : {}
                  ),
                  e.illustrations
                    ? { illustrations: Array.from(e.illustrations) }
                    : {}
                );
              }),
              (t.cloneFeature = function (e) {
                return __assign(
                  __assign(
                    { id: e.id, name: e.name, description: e.description },
                    e.descriptionLegal
                      ? { descriptionLegal: e.descriptionLegal }
                      : {}
                  ),
                  e.illustrations
                    ? { illustrations: Array.from(e.illustrations) }
                    : {}
                );
              }),
              (t.cloneDataCategory = function (e) {
                return { id: e.id, name: e.name, description: e.description };
              }),
              (t.cloneStack = function (e) {
                return {
                  id: e.id,
                  name: e.name,
                  description: e.description,
                  purposes: Array.from(e.purposes),
                  specialFeatures: Array.from(e.specialFeatures),
                };
              }),
              (t.cloneDataRetention = function (e) {
                return __assign(
                  __assign(
                    {},
                    "number" == typeof e.stdRetention
                      ? { stdRetention: e.stdRetention }
                      : {}
                  ),
                  {
                    purposes: __assign({}, e.purposes),
                    specialPurposes: __assign({}, e.specialPurposes),
                  }
                );
              }),
              (t.cloneVendorUrls = function (e) {
                return e.map(function (e) {
                  return __assign(
                    { langId: e.langId, privacy: e.privacy },
                    e.legIntClaim ? { legIntClaim: e.legIntClaim } : {}
                  );
                });
              }),
              (t.cloneVendor = function (e) {
                return __assign(
                  __assign(
                    __assign(
                      __assign(
                        __assign(
                          __assign(
                            __assign(
                              __assign(
                                __assign(
                                  __assign(
                                    __assign(
                                      {
                                        id: e.id,
                                        name: e.name,
                                        purposes: Array.from(e.purposes),
                                        legIntPurposes: Array.from(
                                          e.legIntPurposes
                                        ),
                                        flexiblePurposes: Array.from(
                                          e.flexiblePurposes
                                        ),
                                        specialPurposes: Array.from(
                                          e.specialPurposes
                                        ),
                                        features: Array.from(e.features),
                                        specialFeatures: Array.from(
                                          e.specialFeatures
                                        ),
                                      },
                                      e.overflow
                                        ? {
                                            overflow: {
                                              httpGetLimit:
                                                e.overflow.httpGetLimit,
                                            },
                                          }
                                        : {}
                                    ),
                                    "number" == typeof e.cookieMaxAgeSeconds ||
                                      null === e.cookieMaxAgeSeconds
                                      ? {
                                          cookieMaxAgeSeconds:
                                            e.cookieMaxAgeSeconds,
                                        }
                                      : {}
                                  ),
                                  void 0 !== e.usesCookies
                                    ? { usesCookies: e.usesCookies }
                                    : {}
                                ),
                                e.policyUrl ? { policyUrl: e.policyUrl } : {}
                              ),
                              void 0 !== e.cookieRefresh
                                ? { cookieRefresh: e.cookieRefresh }
                                : {}
                            ),
                            void 0 !== e.usesNonCookieAccess
                              ? { usesNonCookieAccess: e.usesNonCookieAccess }
                              : {}
                          ),
                          e.dataRetention
                            ? {
                                dataRetention: this.cloneDataRetention(
                                  e.dataRetention
                                ),
                              }
                            : {}
                        ),
                        e.urls ? { urls: this.cloneVendorUrls(e.urls) } : {}
                      ),
                      e.dataDeclaration
                        ? { dataDeclaration: Array.from(e.dataDeclaration) }
                        : {}
                    ),
                    e.deviceStorageDisclosureUrl
                      ? {
                          deviceStorageDisclosureUrl:
                            e.deviceStorageDisclosureUrl,
                        }
                      : {}
                  ),
                  e.deletedDate ? { deletedDate: e.deletedDate } : {}
                );
              }),
              (t.prototype.cloneVendors = function () {
                var e,
                  r,
                  n = {};
                try {
                  for (
                    var s = __values(Object.keys(this.fullVendorList)),
                      o = s.next();
                    !o.done;
                    o = s.next()
                  ) {
                    var i = o.value;
                    n[i] = t.cloneVendor(this.fullVendorList[i]);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (r = s.return) && r.call(s);
                  } finally {
                    if (e) throw e.error;
                  }
                }
                return n;
              }),
              (t.prototype.changeLanguage = function (e) {
                return __awaiter(this, void 0, void 0, function () {
                  var r, n, s, o, i, a;
                  return __generator(this, function (l) {
                    switch (l.label) {
                      case 0:
                        r = e;
                        try {
                          r = t.consentLanguages.parseLanguage(e);
                        } catch (e) {
                          throw new index_js_1.GVLError(
                            "Error during parsing the language: " + e.message
                          );
                        }
                        if (
                          ((n = e.toUpperCase()),
                          r.toLowerCase() ===
                            t.DEFAULT_LANGUAGE.toLowerCase() &&
                            !t.LANGUAGE_CACHE.has(n))
                        )
                          return [2];
                        if (r === this.lang_) return [3, 5];
                        if (((this.lang_ = r), !t.LANGUAGE_CACHE.has(n)))
                          return [3, 1];
                        for (o in (s = t.LANGUAGE_CACHE.get(n)))
                          s.hasOwnProperty(o) && (this[o] = s[o]);
                        return [3, 5];
                      case 1:
                        (i =
                          t.baseUrl +
                          t.languageFilename.replace(
                            "[LANG]",
                            this.lang_.toLowerCase()
                          )),
                          (l.label = 2);
                      case 2:
                        return l.trys.push([2, 4, , 5]), [4, this.fetchJson(i)];
                      case 3:
                        return (
                          l.sent(),
                          (this.cacheLang_ = n),
                          this.cacheLanguage(),
                          [3, 5]
                        );
                      case 4:
                        throw (
                          ((a = l.sent()),
                          new index_js_1.GVLError(
                            "unable to load language: " + a.message
                          ))
                        );
                      case 5:
                        return [2];
                    }
                  });
                });
              }),
              Object.defineProperty(t.prototype, "language", {
                get: function () {
                  return this.lang_;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.isVendorList = function (e) {
                return void 0 !== e && void 0 !== e.vendors;
              }),
              (t.prototype.populate = function (e) {
                (this.purposes = e.purposes),
                  (this.specialPurposes = e.specialPurposes),
                  (this.features = e.features),
                  (this.specialFeatures = e.specialFeatures),
                  (this.stacks = e.stacks),
                  (this.dataCategories = e.dataCategories),
                  this.isVendorList(e) &&
                    ((this.gvlSpecificationVersion = e.gvlSpecificationVersion),
                    (this.tcfPolicyVersion = e.tcfPolicyVersion),
                    (this.vendorListVersion = e.vendorListVersion),
                    (this.lastUpdated = e.lastUpdated),
                    "string" == typeof this.lastUpdated &&
                      (this.lastUpdated = new Date(this.lastUpdated)),
                    (this.vendors_ = e.vendors),
                    (this.fullVendorList = e.vendors),
                    this.mapVendors(),
                    (this.isReady_ = !0),
                    this.isLatest &&
                      t.CACHE.set(t.LATEST_CACHE_KEY, this.getJson()),
                    t.CACHE.has(this.vendorListVersion) ||
                      t.CACHE.set(this.vendorListVersion, this.getJson())),
                  this.cacheLanguage();
              }),
              (t.prototype.mapVendors = function (e) {
                var t = this;
                (this.byPurposeVendorMap = {}),
                  (this.bySpecialPurposeVendorMap = {}),
                  (this.byFeatureVendorMap = {}),
                  (this.bySpecialFeatureVendorMap = {}),
                  Object.keys(this.purposes).forEach(function (e) {
                    t.byPurposeVendorMap[e] = {
                      legInt: new Set(),
                      consent: new Set(),
                      flexible: new Set(),
                    };
                  }),
                  Object.keys(this.specialPurposes).forEach(function (e) {
                    t.bySpecialPurposeVendorMap[e] = new Set();
                  }),
                  Object.keys(this.features).forEach(function (e) {
                    t.byFeatureVendorMap[e] = new Set();
                  }),
                  Object.keys(this.specialFeatures).forEach(function (e) {
                    t.bySpecialFeatureVendorMap[e] = new Set();
                  }),
                  Array.isArray(e) ||
                    (e = Object.keys(this.fullVendorList).map(function (e) {
                      return +e;
                    })),
                  (this.vendorIds = new Set(e)),
                  (this.vendors_ = e.reduce(function (e, r) {
                    var n = t.vendors_[String(r)];
                    return (
                      n &&
                        void 0 === n.deletedDate &&
                        (n.purposes.forEach(function (e) {
                          t.byPurposeVendorMap[String(e)].consent.add(r);
                        }),
                        n.specialPurposes.forEach(function (e) {
                          t.bySpecialPurposeVendorMap[String(e)].add(r);
                        }),
                        n.legIntPurposes.forEach(function (e) {
                          t.byPurposeVendorMap[String(e)].legInt.add(r);
                        }),
                        n.flexiblePurposes &&
                          n.flexiblePurposes.forEach(function (e) {
                            t.byPurposeVendorMap[String(e)].flexible.add(r);
                          }),
                        n.features.forEach(function (e) {
                          t.byFeatureVendorMap[String(e)].add(r);
                        }),
                        n.specialFeatures.forEach(function (e) {
                          t.bySpecialFeatureVendorMap[String(e)].add(r);
                        }),
                        (e[r] = n)),
                      e
                    );
                  }, {}));
              }),
              (t.prototype.getFilteredVendors = function (e, t, r, n) {
                var s = this,
                  o = e.charAt(0).toUpperCase() + e.slice(1),
                  i = {};
                return (
                  ("purpose" === e && r
                    ? this["by" + o + "VendorMap"][String(t)][r]
                    : this["by" + (n ? "Special" : "") + o + "VendorMap"][
                        String(t)
                      ]
                  ).forEach(function (e) {
                    i[String(e)] = s.vendors[String(e)];
                  }),
                  i
                );
              }),
              (t.prototype.getVendorsWithConsentPurpose = function (e) {
                return this.getFilteredVendors("purpose", e, "consent");
              }),
              (t.prototype.getVendorsWithLegIntPurpose = function (e) {
                return this.getFilteredVendors("purpose", e, "legInt");
              }),
              (t.prototype.getVendorsWithFlexiblePurpose = function (e) {
                return this.getFilteredVendors("purpose", e, "flexible");
              }),
              (t.prototype.getVendorsWithSpecialPurpose = function (e) {
                return this.getFilteredVendors("purpose", e, void 0, !0);
              }),
              (t.prototype.getVendorsWithFeature = function (e) {
                return this.getFilteredVendors("feature", e);
              }),
              (t.prototype.getVendorsWithSpecialFeature = function (e) {
                return this.getFilteredVendors("feature", e, void 0, !0);
              }),
              Object.defineProperty(t.prototype, "vendors", {
                get: function () {
                  return this.vendors_;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.narrowVendorsTo = function (e) {
                this.mapVendors(e);
              }),
              Object.defineProperty(t.prototype, "isReady", {
                get: function () {
                  return this.isReady_;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.clone = function () {
                var e = new t(this.getJson());
                return (
                  this.lang_ !== t.DEFAULT_LANGUAGE &&
                    e.changeLanguage(this.lang_),
                  e
                );
              }),
              (t.isInstanceOf = function (e) {
                return (
                  "object" == typeof e && "function" == typeof e.narrowVendorsTo
                );
              }),
              (t.LANGUAGE_CACHE = new Map()),
              (t.CACHE = new Map()),
              (t.LATEST_CACHE_KEY = 0),
              (t.DEFAULT_LANGUAGE = "EN"),
              (t.consentLanguages = new index_js_2.ConsentLanguages()),
              (t.latestFilename = "vendor-list.json"),
              (t.versionedFilename = "archives/vendor-list-v[VERSION].json"),
              (t.languageFilename = "purposes-[LANG].json"),
              t
            );
          })(Cloneable_js_1.Cloneable);
        exports.GVL = GVL;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/Json.js":
      /*!**********************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/Json.js ***!
  \**********************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Json = void 0);
        var Json = (function () {
          function e() {}
          return (
            (e.absCall = function (e, t, n, r) {
              return new Promise(function (o, s) {
                var i = new XMLHttpRequest();
                (i.withCredentials = n),
                  i.addEventListener("load", function () {
                    if (i.readyState == XMLHttpRequest.DONE)
                      if (i.status >= 200 && i.status < 300) {
                        var e = i.response;
                        if ("string" == typeof e)
                          try {
                            e = JSON.parse(e);
                          } catch (e) {}
                        o(e);
                      } else
                        s(
                          new Error(
                            "HTTP Status: "
                              .concat(i.status, " response type: ")
                              .concat(i.responseType)
                          )
                        );
                  }),
                  i.addEventListener("error", function () {
                    s(new Error("error"));
                  }),
                  i.addEventListener("abort", function () {
                    s(new Error("aborted"));
                  }),
                  null === t ? i.open("GET", e, !0) : i.open("POST", e, !0),
                  (i.responseType = "json"),
                  (i.timeout = r),
                  (i.ontimeout = function () {
                    s(new Error("Timeout " + r + "ms " + e));
                  }),
                  i.send(t);
              });
            }),
            (e.post = function (e, t, n, r) {
              return (
                void 0 === n && (n = !1),
                void 0 === r && (r = 0),
                this.absCall(e, JSON.stringify(t), n, r)
              );
            }),
            (e.fetch = function (e, t, n) {
              return (
                void 0 === t && (t = !1),
                void 0 === n && (n = 0),
                this.absCall(e, null, t, n)
              );
            }),
            e
          );
        })();
        exports.Json = Json;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/TCModel.js":
      /*!*************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/TCModel.js ***!
  \*************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var e = function (t, n) {
              return (e =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, t) {
                    e.__proto__ = t;
                  }) ||
                function (e, t) {
                  for (var n in t)
                    Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                })(t, n);
            };
            return function (t, n) {
              if ("function" != typeof n && null !== n)
                throw new TypeError(
                  "Class extends value " +
                    String(n) +
                    " is not a constructor or null"
                );
              function s() {
                this.constructor = t;
              }
              e(t, n),
                (t.prototype =
                  null === n
                    ? Object.create(n)
                    : ((s.prototype = n.prototype), new s()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TCModel = void 0);
        var Cloneable_js_1 = __webpack_require__(
            /*! ./Cloneable.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ./errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          GVL_js_1 = __webpack_require__(
            /*! ./GVL.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/GVL.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ./model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          TCModel = (function (e) {
            function t(t) {
              var n = e.call(this) || this;
              return (
                (n.isServiceSpecific_ = !1),
                (n.supportOOB_ = !0),
                (n.useNonStandardTexts_ = !1),
                (n.purposeOneTreatment_ = !1),
                (n.publisherCountryCode_ = "AA"),
                (n.version_ = 2),
                (n.consentScreen_ = 0),
                (n.policyVersion_ = 4),
                (n.consentLanguage_ = "EN"),
                (n.cmpId_ = 0),
                (n.cmpVersion_ = 0),
                (n.vendorListVersion_ = 0),
                (n.numCustomPurposes_ = 0),
                (n.specialFeatureOptins = new index_js_2.Vector()),
                (n.purposeConsents = new index_js_2.Vector()),
                (n.purposeLegitimateInterests = new index_js_2.Vector()),
                (n.publisherConsents = new index_js_2.Vector()),
                (n.publisherLegitimateInterests = new index_js_2.Vector()),
                (n.publisherCustomConsents = new index_js_2.Vector()),
                (n.publisherCustomLegitimateInterests =
                  new index_js_2.Vector()),
                (n.vendorConsents = new index_js_2.Vector()),
                (n.vendorLegitimateInterests = new index_js_2.Vector()),
                (n.vendorsDisclosed = new index_js_2.Vector()),
                (n.vendorsAllowed = new index_js_2.Vector()),
                (n.publisherRestrictions =
                  new index_js_2.PurposeRestrictionVector()),
                t && (n.gvl = t),
                n.updated(),
                n
              );
            }
            return (
              __extends(t, e),
              Object.defineProperty(t.prototype, "gvl", {
                get: function () {
                  return this.gvl_;
                },
                set: function (e) {
                  GVL_js_1.GVL.isInstanceOf(e) || (e = new GVL_js_1.GVL(e)),
                    (this.gvl_ = e),
                    (this.publisherRestrictions.gvl = e);
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "cmpId", {
                get: function () {
                  return this.cmpId_;
                },
                set: function (e) {
                  if (((e = Number(e)), !(Number.isInteger(e) && e > 1)))
                    throw new index_js_1.TCModelError("cmpId", e);
                  this.cmpId_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "cmpVersion", {
                get: function () {
                  return this.cmpVersion_;
                },
                set: function (e) {
                  if (((e = Number(e)), !(Number.isInteger(e) && e > -1)))
                    throw new index_js_1.TCModelError("cmpVersion", e);
                  this.cmpVersion_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "consentScreen", {
                get: function () {
                  return this.consentScreen_;
                },
                set: function (e) {
                  if (((e = Number(e)), !(Number.isInteger(e) && e > -1)))
                    throw new index_js_1.TCModelError("consentScreen", e);
                  this.consentScreen_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "consentLanguage", {
                get: function () {
                  return this.consentLanguage_;
                },
                set: function (e) {
                  this.consentLanguage_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "publisherCountryCode", {
                get: function () {
                  return this.publisherCountryCode_;
                },
                set: function (e) {
                  if (!/^([A-z]){2}$/.test(e))
                    throw new index_js_1.TCModelError(
                      "publisherCountryCode",
                      e
                    );
                  this.publisherCountryCode_ = e.toUpperCase();
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "vendorListVersion", {
                get: function () {
                  return this.gvl
                    ? this.gvl.vendorListVersion
                    : this.vendorListVersion_;
                },
                set: function (e) {
                  if ((e = Number(e) >> 0) < 0)
                    throw new index_js_1.TCModelError("vendorListVersion", e);
                  this.vendorListVersion_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "policyVersion", {
                get: function () {
                  return this.gvl
                    ? this.gvl.tcfPolicyVersion
                    : this.policyVersion_;
                },
                set: function (e) {
                  if (
                    ((this.policyVersion_ = parseInt(e, 10)),
                    this.policyVersion_ < 0)
                  )
                    throw new index_js_1.TCModelError("policyVersion", e);
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "version", {
                get: function () {
                  return this.version_;
                },
                set: function (e) {
                  this.version_ = parseInt(e, 10);
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "isServiceSpecific", {
                get: function () {
                  return this.isServiceSpecific_;
                },
                set: function (e) {
                  this.isServiceSpecific_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "useNonStandardTexts", {
                get: function () {
                  return this.useNonStandardTexts_;
                },
                set: function (e) {
                  this.useNonStandardTexts_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "supportOOB", {
                get: function () {
                  return this.supportOOB_;
                },
                set: function (e) {
                  this.supportOOB_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "purposeOneTreatment", {
                get: function () {
                  return this.purposeOneTreatment_;
                },
                set: function (e) {
                  this.purposeOneTreatment_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.setAllVendorConsents = function () {
                this.vendorConsents.set(this.gvl.vendors);
              }),
              (t.prototype.unsetAllVendorConsents = function () {
                this.vendorConsents.empty();
              }),
              (t.prototype.setAllVendorsDisclosed = function () {
                this.vendorsDisclosed.set(this.gvl.vendors);
              }),
              (t.prototype.unsetAllVendorsDisclosed = function () {
                this.vendorsDisclosed.empty();
              }),
              (t.prototype.setAllVendorsAllowed = function () {
                this.vendorsAllowed.set(this.gvl.vendors);
              }),
              (t.prototype.unsetAllVendorsAllowed = function () {
                this.vendorsAllowed.empty();
              }),
              (t.prototype.setAllVendorLegitimateInterests = function () {
                this.vendorLegitimateInterests.set(this.gvl.vendors);
              }),
              (t.prototype.unsetAllVendorLegitimateInterests = function () {
                this.vendorLegitimateInterests.empty();
              }),
              (t.prototype.setAllPurposeConsents = function () {
                this.purposeConsents.set(this.gvl.purposes);
              }),
              (t.prototype.unsetAllPurposeConsents = function () {
                this.purposeConsents.empty();
              }),
              (t.prototype.setAllPurposeLegitimateInterests = function () {
                this.purposeLegitimateInterests.set(this.gvl.purposes);
              }),
              (t.prototype.unsetAllPurposeLegitimateInterests = function () {
                this.purposeLegitimateInterests.empty();
              }),
              (t.prototype.setAllSpecialFeatureOptins = function () {
                this.specialFeatureOptins.set(this.gvl.specialFeatures);
              }),
              (t.prototype.unsetAllSpecialFeatureOptins = function () {
                this.specialFeatureOptins.empty();
              }),
              (t.prototype.setAll = function () {
                this.setAllVendorConsents(),
                  this.setAllPurposeLegitimateInterests(),
                  this.setAllSpecialFeatureOptins(),
                  this.setAllPurposeConsents(),
                  this.setAllVendorLegitimateInterests();
              }),
              (t.prototype.unsetAll = function () {
                this.unsetAllVendorConsents(),
                  this.unsetAllPurposeLegitimateInterests(),
                  this.unsetAllSpecialFeatureOptins(),
                  this.unsetAllPurposeConsents(),
                  this.unsetAllVendorLegitimateInterests();
              }),
              Object.defineProperty(t.prototype, "numCustomPurposes", {
                get: function () {
                  var e = this.numCustomPurposes_;
                  if ("object" == typeof this.customPurposes) {
                    var t = Object.keys(this.customPurposes).sort(function (
                      e,
                      t
                    ) {
                      return Number(e) - Number(t);
                    });
                    e = parseInt(t.pop(), 10);
                  }
                  return e;
                },
                set: function (e) {
                  if (
                    ((this.numCustomPurposes_ = parseInt(e, 10)),
                    this.numCustomPurposes_ < 0)
                  )
                    throw new index_js_1.TCModelError("numCustomPurposes", e);
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.updated = function () {
                var e = new Date(),
                  t = new Date(
                    Date.UTC(
                      e.getUTCFullYear(),
                      e.getUTCMonth(),
                      e.getUTCDate()
                    )
                  );
                (this.created = t), (this.lastUpdated = t);
              }),
              (t.consentLanguages = GVL_js_1.GVL.consentLanguages),
              t
            );
          })(Cloneable_js_1.Cloneable);
        exports.TCModel = TCModel;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/TCString.js":
      /*!**************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/TCString.js ***!
  \**************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TCString = void 0);
        var index_js_1 = __webpack_require__(
            /*! ./encoder/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/index.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ./model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          IntEncoder_js_1 = __webpack_require__(
            /*! ./encoder/field/IntEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js"
          ),
          TCModel_js_1 = __webpack_require__(
            /*! ./TCModel.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/TCModel.js"
          ),
          TCString = (function () {
            function e() {}
            return (
              (e.encode = function (e, n) {
                var r,
                  t = "";
                return (
                  (e = index_js_1.SemanticPreEncoder.process(e, n)),
                  (r = Array.isArray(null == n ? void 0 : n.segments)
                    ? n.segments
                    : new index_js_1.SegmentSequence(e, n)[
                        "" + e.version
                      ]).forEach(function (n, d) {
                    var s = "";
                    d < r.length - 1 && (s = "."),
                      (t += index_js_1.SegmentEncoder.encode(e, n) + s);
                  }),
                  t
                );
              }),
              (e.decode = function (e, n) {
                var r = e.split("."),
                  t = r.length;
                n || (n = new TCModel_js_1.TCModel());
                for (var d = 0; d < t; d++) {
                  var s = r[d],
                    i = index_js_1.Base64Url.decode(s.charAt(0)).substr(
                      0,
                      index_js_1.BitLength.segmentType
                    ),
                    o =
                      index_js_2.SegmentIDs.ID_TO_KEY[
                        IntEncoder_js_1.IntEncoder.decode(
                          i,
                          index_js_1.BitLength.segmentType
                        ).toString()
                      ];
                  index_js_1.SegmentEncoder.decode(s, n, o);
                }
                return n;
              }),
              e
            );
          })();
        exports.TCString = TCString;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/Base64Url.js":
      /*!***********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/Base64Url.js ***!
  \***********************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Base64Url = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          Base64Url = (function () {
            function e() {}
            return (
              (e.encode = function (e) {
                if (!/^[0-1]+$/.test(e))
                  throw new index_js_1.EncodingError("Invalid bitField");
                var r = e.length % this.LCM;
                e += r ? "0".repeat(this.LCM - r) : "";
                for (var t = "", n = 0; n < e.length; n += this.BASIS)
                  t += this.DICT[parseInt(e.substr(n, this.BASIS), 2)];
                return t;
              }),
              (e.decode = function (e) {
                if (!/^[A-Za-z0-9\-_]+$/.test(e))
                  throw new index_js_1.DecodingError(
                    "Invalidly encoded Base64URL string"
                  );
                for (var r = "", t = 0; t < e.length; t++) {
                  var n = this.REVERSE_DICT.get(e[t]).toString(2);
                  r += "0".repeat(this.BASIS - n.length) + n;
                }
                return r;
              }),
              (e.DICT =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),
              (e.REVERSE_DICT = new Map([
                ["A", 0],
                ["B", 1],
                ["C", 2],
                ["D", 3],
                ["E", 4],
                ["F", 5],
                ["G", 6],
                ["H", 7],
                ["I", 8],
                ["J", 9],
                ["K", 10],
                ["L", 11],
                ["M", 12],
                ["N", 13],
                ["O", 14],
                ["P", 15],
                ["Q", 16],
                ["R", 17],
                ["S", 18],
                ["T", 19],
                ["U", 20],
                ["V", 21],
                ["W", 22],
                ["X", 23],
                ["Y", 24],
                ["Z", 25],
                ["a", 26],
                ["b", 27],
                ["c", 28],
                ["d", 29],
                ["e", 30],
                ["f", 31],
                ["g", 32],
                ["h", 33],
                ["i", 34],
                ["j", 35],
                ["k", 36],
                ["l", 37],
                ["m", 38],
                ["n", 39],
                ["o", 40],
                ["p", 41],
                ["q", 42],
                ["r", 43],
                ["s", 44],
                ["t", 45],
                ["u", 46],
                ["v", 47],
                ["w", 48],
                ["x", 49],
                ["y", 50],
                ["z", 51],
                ["0", 52],
                ["1", 53],
                ["2", 54],
                ["3", 55],
                ["4", 56],
                ["5", 57],
                ["6", 58],
                ["7", 59],
                ["8", 60],
                ["9", 61],
                ["-", 62],
                ["_", 63],
              ])),
              (e.BASIS = 6),
              (e.LCM = 24),
              e
            );
          })();
        exports.Base64Url = Base64Url;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/BitLength.js":
      /*!***********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/BitLength.js ***!
  \***********************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BitLength = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          BitLength = (function () {
            function e() {}
            var s, i, n, d, t, r, _, o, l, p, x, u, j, a, F, c, g, m;
            return (
              (s = index_js_1.Fields.cmpId),
              (i = index_js_1.Fields.cmpVersion),
              (n = index_js_1.Fields.consentLanguage),
              (d = index_js_1.Fields.consentScreen),
              (t = index_js_1.Fields.created),
              (r = index_js_1.Fields.isServiceSpecific),
              (_ = index_js_1.Fields.lastUpdated),
              (o = index_js_1.Fields.policyVersion),
              (l = index_js_1.Fields.publisherCountryCode),
              (p = index_js_1.Fields.publisherLegitimateInterests),
              (x = index_js_1.Fields.publisherConsents),
              (u = index_js_1.Fields.purposeConsents),
              (j = index_js_1.Fields.purposeLegitimateInterests),
              (a = index_js_1.Fields.purposeOneTreatment),
              (F = index_js_1.Fields.specialFeatureOptins),
              (c = index_js_1.Fields.useNonStandardTexts),
              (g = index_js_1.Fields.vendorListVersion),
              (m = index_js_1.Fields.version),
              (e[s] = 12),
              (e[i] = 12),
              (e[n] = 12),
              (e[d] = 6),
              (e[t] = 36),
              (e[r] = 1),
              (e[_] = 36),
              (e[o] = 6),
              (e[l] = 12),
              (e[p] = 24),
              (e[x] = 24),
              (e[u] = 24),
              (e[j] = 24),
              (e[a] = 1),
              (e[F] = 12),
              (e[c] = 1),
              (e[g] = 12),
              (e[m] = 6),
              (e.anyBoolean = 1),
              (e.encodingType = 1),
              (e.maxId = 16),
              (e.numCustomPurposes = 6),
              (e.numEntries = 12),
              (e.numRestrictions = 12),
              (e.purposeId = 6),
              (e.restrictionType = 2),
              (e.segmentType = 3),
              (e.singleOrRange = 1),
              (e.vendorId = 16),
              e
            );
          })();
        exports.BitLength = BitLength;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/EncodingOptions.js":
      /*!*****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/EncodingOptions.js ***!
  \*****************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/SegmentEncoder.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/SegmentEncoder.js ***!
  \****************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SegmentEncoder = void 0);
        var Base64Url_js_1 = __webpack_require__(
            /*! ./Base64Url.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/Base64Url.js"
          ),
          BitLength_js_1 = __webpack_require__(
            /*! ./BitLength.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/BitLength.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ./field/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/index.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ./sequence/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/index.js"
          ),
          index_js_3 = __webpack_require__(
            /*! ../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          Fields_js_1 = __webpack_require__(
            /*! ../model/Fields.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Fields.js"
          ),
          index_js_4 = __webpack_require__(
            /*! ../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          SegmentEncoder = (function () {
            function e() {}
            return (
              (e.encode = function (e, n) {
                var s,
                  i = this;
                try {
                  s = this.fieldSequence[String(e.version)][n];
                } catch (s) {
                  throw new index_js_3.EncodingError(
                    "Unable to encode version: "
                      .concat(e.version, ", segment: ")
                      .concat(n)
                  );
                }
                var r = "";
                n !== index_js_4.Segment.CORE &&
                  (r = index_js_1.IntEncoder.encode(
                    index_js_4.SegmentIDs.KEY_TO_ID[n],
                    BitLength_js_1.BitLength.segmentType
                  ));
                var t = (0, index_js_1.FieldEncoderMap)();
                return (
                  s.forEach(function (s) {
                    var d = e[s],
                      o = t[s],
                      _ = BitLength_js_1.BitLength[s];
                    void 0 === _ &&
                      i.isPublisherCustom(s) &&
                      (_ = Number(e[Fields_js_1.Fields.numCustomPurposes]));
                    try {
                      r += o.encode(d, _);
                    } catch (e) {
                      throw new index_js_3.EncodingError(
                        "Error encoding "
                          .concat(n, "->")
                          .concat(s, ": ")
                          .concat(e.message)
                      );
                    }
                  }),
                  Base64Url_js_1.Base64Url.encode(r)
                );
              }),
              (e.decode = function (e, n, s) {
                var i = this,
                  r = Base64Url_js_1.Base64Url.decode(e),
                  t = 0;
                s === index_js_4.Segment.CORE &&
                  (n.version = index_js_1.IntEncoder.decode(
                    r.substr(
                      t,
                      BitLength_js_1.BitLength[Fields_js_1.Fields.version]
                    ),
                    BitLength_js_1.BitLength[Fields_js_1.Fields.version]
                  )),
                  s !== index_js_4.Segment.CORE &&
                    (t += BitLength_js_1.BitLength.segmentType);
                var d = this.fieldSequence[String(n.version)][s],
                  o = (0, index_js_1.FieldEncoderMap)();
                return (
                  d.forEach(function (e) {
                    var s = o[e],
                      d = BitLength_js_1.BitLength[e];
                    if (
                      (void 0 === d &&
                        i.isPublisherCustom(e) &&
                        (d = Number(n[Fields_js_1.Fields.numCustomPurposes])),
                      0 !== d)
                    ) {
                      var _ = r.substr(t, d);
                      if (
                        (s === index_js_1.VendorVectorEncoder
                          ? (n[e] = s.decode(_, n.version))
                          : (n[e] = s.decode(_, d)),
                        Number.isInteger(d))
                      )
                        t += d;
                      else {
                        if (!Number.isInteger(n[e].bitLength))
                          throw new index_js_3.DecodingError(e);
                        t += n[e].bitLength;
                      }
                    }
                  }),
                  n
                );
              }),
              (e.isPublisherCustom = function (e) {
                return 0 === e.indexOf("publisherCustom");
              }),
              (e.fieldSequence = new index_js_2.FieldSequence()),
              e
            );
          })();
        exports.SegmentEncoder = SegmentEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/SemanticPreEncoder.js":
      /*!********************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/SemanticPreEncoder.js ***!
  \********************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SemanticPreEncoder = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          SemanticPreEncoder = (function () {
            function e() {}
            return (
              (e.process = function (e, s) {
                var n = e.gvl;
                if (!n)
                  throw new index_js_1.EncodingError(
                    "Unable to encode TCModel without a GVL"
                  );
                if (!n.isReady)
                  throw new index_js_1.EncodingError(
                    "Unable to encode TCModel tcModel.gvl.readyPromise is not resolved"
                  );
                ((e = e.clone()).consentLanguage = n.language
                  .slice(0, 2)
                  .toUpperCase()),
                  (null == s ? void 0 : s.version) > 0 &&
                  (null == s ? void 0 : s.version) <= this.processor.length
                    ? (e.version = s.version)
                    : (e.version = this.processor.length);
                var r = e.version - 1;
                if (!this.processor[r])
                  throw new index_js_1.EncodingError(
                    "Invalid version: ".concat(e.version)
                  );
                return this.processor[r](e, n);
              }),
              (e.processor = [
                function (e) {
                  return e;
                },
                function (e, s) {
                  (e.publisherRestrictions.gvl = s),
                    e.purposeLegitimateInterests.unset([1, 3, 4, 5, 6]);
                  var n = new Map();
                  return (
                    n.set("legIntPurposes", e.vendorLegitimateInterests),
                    n.set("purposes", e.vendorConsents),
                    n.forEach(function (n, r) {
                      n.forEach(function (o, t) {
                        if (o) {
                          var i = s.vendors[t];
                          if (!i || i.deletedDate) n.unset(t);
                          else if (0 === i[r].length)
                            if (
                              "legIntPurposes" === r &&
                              0 === i.purposes.length &&
                              0 === i.legIntPurposes.length &&
                              i.specialPurposes.length > 0
                            )
                              n.set(t);
                            else if (
                              "legIntPurposes" === r &&
                              i.purposes.length > 0 &&
                              0 === i.legIntPurposes.length &&
                              i.specialPurposes.length > 0
                            )
                              n.set(t);
                            else if (e.isServiceSpecific)
                              if (0 === i.flexiblePurposes.length) n.unset(t);
                              else {
                                for (
                                  var l =
                                      e.publisherRestrictions.getRestrictions(
                                        t
                                      ),
                                    c = !1,
                                    u = 0,
                                    p = l.length;
                                  u < p && !c;
                                  u++
                                )
                                  c =
                                    (l[u].restrictionType ===
                                      index_js_2.RestrictionType
                                        .REQUIRE_CONSENT &&
                                      "purposes" === r) ||
                                    (l[u].restrictionType ===
                                      index_js_2.RestrictionType.REQUIRE_LI &&
                                      "legIntPurposes" === r);
                                c || n.unset(t);
                              }
                            else n.unset(t);
                        }
                      });
                    }),
                    e.vendorsDisclosed.set(s.vendors),
                    e
                  );
                },
              ]),
              e
            );
          })();
        exports.SemanticPreEncoder = SemanticPreEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/BooleanEncoder.js":
      /*!**********************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/BooleanEncoder.js ***!
  \**********************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BooleanEncoder = void 0);
        var BooleanEncoder = (function () {
          function e() {}
          return (
            (e.encode = function (e) {
              return String(Number(e));
            }),
            (e.decode = function (e) {
              return "1" === e;
            }),
            e
          );
        })();
        exports.BooleanEncoder = BooleanEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/DateEncoder.js":
      /*!*******************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/DateEncoder.js ***!
  \*******************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DateEncoder = void 0);
        var IntEncoder_js_1 = __webpack_require__(
            /*! ./IntEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          DateEncoder = (function () {
            function e() {}
            return (
              (e.encode = function (e, n) {
                return IntEncoder_js_1.IntEncoder.encode(
                  Math.round(e.getTime() / 100),
                  n
                );
              }),
              (e.decode = function (e, n) {
                if (n !== e.length)
                  throw new index_js_1.DecodingError("invalid bit length");
                var r = new Date();
                return (
                  r.setTime(100 * IntEncoder_js_1.IntEncoder.decode(e, n)), r
                );
              }),
              e
            );
          })();
        exports.DateEncoder = DateEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FieldEncoderMap.js":
      /*!***********************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FieldEncoderMap.js ***!
  \***********************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FieldEncoderMap = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          BooleanEncoder_js_1 = __webpack_require__(
            /*! ./BooleanEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/BooleanEncoder.js"
          ),
          DateEncoder_js_1 = __webpack_require__(
            /*! ./DateEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/DateEncoder.js"
          ),
          FixedVectorEncoder_js_1 = __webpack_require__(
            /*! ./FixedVectorEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FixedVectorEncoder.js"
          ),
          IntEncoder_js_1 = __webpack_require__(
            /*! ./IntEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js"
          ),
          LangEncoder_js_1 = __webpack_require__(
            /*! ./LangEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/LangEncoder.js"
          ),
          PurposeRestrictionVectorEncoder_js_1 = __webpack_require__(
            /*! ./PurposeRestrictionVectorEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/PurposeRestrictionVectorEncoder.js"
          ),
          VendorVectorEncoder_js_1 = __webpack_require__(
            /*! ./VendorVectorEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VendorVectorEncoder.js"
          );
        function FieldEncoderMap() {
          var e;
          return (
            ((e = {})[index_js_1.Fields.version] = IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.created] = DateEncoder_js_1.DateEncoder),
            (e[index_js_1.Fields.lastUpdated] = DateEncoder_js_1.DateEncoder),
            (e[index_js_1.Fields.cmpId] = IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.cmpVersion] = IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.consentScreen] = IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.consentLanguage] =
              LangEncoder_js_1.LangEncoder),
            (e[index_js_1.Fields.vendorListVersion] =
              IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.policyVersion] = IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.isServiceSpecific] =
              BooleanEncoder_js_1.BooleanEncoder),
            (e[index_js_1.Fields.useNonStandardTexts] =
              BooleanEncoder_js_1.BooleanEncoder),
            (e[index_js_1.Fields.specialFeatureOptins] =
              FixedVectorEncoder_js_1.FixedVectorEncoder),
            (e[index_js_1.Fields.purposeConsents] =
              FixedVectorEncoder_js_1.FixedVectorEncoder),
            (e[index_js_1.Fields.purposeLegitimateInterests] =
              FixedVectorEncoder_js_1.FixedVectorEncoder),
            (e[index_js_1.Fields.purposeOneTreatment] =
              BooleanEncoder_js_1.BooleanEncoder),
            (e[index_js_1.Fields.publisherCountryCode] =
              LangEncoder_js_1.LangEncoder),
            (e[index_js_1.Fields.vendorConsents] =
              VendorVectorEncoder_js_1.VendorVectorEncoder),
            (e[index_js_1.Fields.vendorLegitimateInterests] =
              VendorVectorEncoder_js_1.VendorVectorEncoder),
            (e[index_js_1.Fields.publisherRestrictions] =
              PurposeRestrictionVectorEncoder_js_1.PurposeRestrictionVectorEncoder),
            (e.segmentType = IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.vendorsDisclosed] =
              VendorVectorEncoder_js_1.VendorVectorEncoder),
            (e[index_js_1.Fields.vendorsAllowed] =
              VendorVectorEncoder_js_1.VendorVectorEncoder),
            (e[index_js_1.Fields.publisherConsents] =
              FixedVectorEncoder_js_1.FixedVectorEncoder),
            (e[index_js_1.Fields.publisherLegitimateInterests] =
              FixedVectorEncoder_js_1.FixedVectorEncoder),
            (e[index_js_1.Fields.numCustomPurposes] =
              IntEncoder_js_1.IntEncoder),
            (e[index_js_1.Fields.publisherCustomConsents] =
              FixedVectorEncoder_js_1.FixedVectorEncoder),
            (e[index_js_1.Fields.publisherCustomLegitimateInterests] =
              FixedVectorEncoder_js_1.FixedVectorEncoder),
            e
          );
        }
        exports.FieldEncoderMap = FieldEncoderMap;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FixedVectorEncoder.js":
      /*!**************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FixedVectorEncoder.js ***!
  \**************************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FixedVectorEncoder = void 0);
        var BooleanEncoder_js_1 = __webpack_require__(
            /*! ./BooleanEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/BooleanEncoder.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ../../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          FixedVectorEncoder = (function () {
            function e() {}
            return (
              (e.encode = function (e, o) {
                for (var n = "", r = 1; r <= o; r++)
                  n += BooleanEncoder_js_1.BooleanEncoder.encode(e.has(r));
                return n;
              }),
              (e.decode = function (e, o) {
                if (e.length !== o)
                  throw new index_js_1.DecodingError(
                    "bitfield encoding length mismatch"
                  );
                for (var n = new index_js_2.Vector(), r = 1; r <= o; r++)
                  BooleanEncoder_js_1.BooleanEncoder.decode(e[r - 1]) &&
                    n.set(r);
                return (n.bitLength = e.length), n;
              }),
              e
            );
          })();
        exports.FixedVectorEncoder = FixedVectorEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js":
      /*!******************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js ***!
  \******************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.IntEncoder = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          IntEncoder = (function () {
            function e() {}
            return (
              (e.encode = function (e, n) {
                var t;
                if (
                  ("string" == typeof e && (e = parseInt(e, 10)),
                  (t = e.toString(2)).length > n || e < 0)
                )
                  throw new index_js_1.EncodingError(
                    "".concat(e, " too large to encode into ").concat(n)
                  );
                return t.length < n && (t = "0".repeat(n - t.length) + t), t;
              }),
              (e.decode = function (e, n) {
                if (n !== e.length)
                  throw new index_js_1.DecodingError("invalid bit length");
                return parseInt(e, 2);
              }),
              e
            );
          })();
        exports.IntEncoder = IntEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/LangEncoder.js":
      /*!*******************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/LangEncoder.js ***!
  \*******************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LangEncoder = void 0);
        var IntEncoder_js_1 = __webpack_require__(
            /*! ./IntEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          LangEncoder = (function () {
            function e() {}
            return (
              (e.encode = function (e, n) {
                var r = (e = e.toUpperCase()).charCodeAt(0) - 65,
                  o = e.charCodeAt(1) - 65;
                if (r < 0 || r > 25 || o < 0 || o > 25)
                  throw new index_js_1.EncodingError(
                    "invalid language code: ".concat(e)
                  );
                if (n % 2 == 1)
                  throw new index_js_1.EncodingError(
                    "numBits must be even, ".concat(n, " is not valid")
                  );
                return (
                  (n /= 2),
                  IntEncoder_js_1.IntEncoder.encode(r, n) +
                    IntEncoder_js_1.IntEncoder.encode(o, n)
                );
              }),
              (e.decode = function (e, n) {
                if (n !== e.length || e.length % 2)
                  throw new index_js_1.DecodingError(
                    "invalid bit length for language"
                  );
                var r = e.length / 2,
                  o = IntEncoder_js_1.IntEncoder.decode(e.slice(0, r), r) + 65,
                  d = IntEncoder_js_1.IntEncoder.decode(e.slice(r), r) + 65;
                return String.fromCharCode(o) + String.fromCharCode(d);
              }),
              e
            );
          })();
        exports.LangEncoder = LangEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/PurposeRestrictionVectorEncoder.js":
      /*!***************************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/PurposeRestrictionVectorEncoder.js ***!
  \***************************************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PurposeRestrictionVectorEncoder = void 0);
        var BitLength_js_1 = __webpack_require__(
            /*! ../BitLength.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/BitLength.js"
          ),
          BooleanEncoder_js_1 = __webpack_require__(
            /*! ./BooleanEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/BooleanEncoder.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          IntEncoder_js_1 = __webpack_require__(
            /*! ./IntEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ../../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          PurposeRestrictionVectorEncoder = (function () {
            function e() {}
            return (
              (e.encode = function (e) {
                var n = IntEncoder_js_1.IntEncoder.encode(
                  e.numRestrictions,
                  BitLength_js_1.BitLength.numRestrictions
                );
                if (!e.isEmpty()) {
                  var t = function (n, t) {
                    for (var r = n + 1; r <= t; r++)
                      if (e.gvl.vendorIds.has(r)) return r;
                    return n;
                  };
                  e.getRestrictions().forEach(function (r) {
                    (n += IntEncoder_js_1.IntEncoder.encode(
                      r.purposeId,
                      BitLength_js_1.BitLength.purposeId
                    )),
                      (n += IntEncoder_js_1.IntEncoder.encode(
                        r.restrictionType,
                        BitLength_js_1.BitLength.restrictionType
                      ));
                    for (
                      var o = e.getVendors(r),
                        i = o.length,
                        s = 0,
                        d = 0,
                        _ = "",
                        c = 0;
                      c < i;
                      c++
                    ) {
                      var B = o[c];
                      if (
                        (0 === d && (s++, (d = B)),
                        c === i - 1 || o[c + 1] > t(B, o[i - 1]))
                      ) {
                        var g = !(B === d);
                        (_ += BooleanEncoder_js_1.BooleanEncoder.encode(g)),
                          (_ += IntEncoder_js_1.IntEncoder.encode(
                            d,
                            BitLength_js_1.BitLength.vendorId
                          )),
                          g &&
                            (_ += IntEncoder_js_1.IntEncoder.encode(
                              B,
                              BitLength_js_1.BitLength.vendorId
                            )),
                          (d = 0);
                      }
                    }
                    (n += IntEncoder_js_1.IntEncoder.encode(
                      s,
                      BitLength_js_1.BitLength.numEntries
                    )),
                      (n += _);
                  });
                }
                return n;
              }),
              (e.decode = function (e) {
                var n = 0,
                  t = new index_js_2.PurposeRestrictionVector(),
                  r = IntEncoder_js_1.IntEncoder.decode(
                    e.substr(n, BitLength_js_1.BitLength.numRestrictions),
                    BitLength_js_1.BitLength.numRestrictions
                  );
                n += BitLength_js_1.BitLength.numRestrictions;
                for (var o = 0; o < r; o++) {
                  var i = IntEncoder_js_1.IntEncoder.decode(
                    e.substr(n, BitLength_js_1.BitLength.purposeId),
                    BitLength_js_1.BitLength.purposeId
                  );
                  n += BitLength_js_1.BitLength.purposeId;
                  var s = IntEncoder_js_1.IntEncoder.decode(
                    e.substr(n, BitLength_js_1.BitLength.restrictionType),
                    BitLength_js_1.BitLength.restrictionType
                  );
                  n += BitLength_js_1.BitLength.restrictionType;
                  var d = new index_js_2.PurposeRestriction(i, s),
                    _ = IntEncoder_js_1.IntEncoder.decode(
                      e.substr(n, BitLength_js_1.BitLength.numEntries),
                      BitLength_js_1.BitLength.numEntries
                    );
                  n += BitLength_js_1.BitLength.numEntries;
                  for (var c = 0; c < _; c++) {
                    var B = BooleanEncoder_js_1.BooleanEncoder.decode(
                      e.substr(n, BitLength_js_1.BitLength.anyBoolean)
                    );
                    n += BitLength_js_1.BitLength.anyBoolean;
                    var g = IntEncoder_js_1.IntEncoder.decode(
                      e.substr(n, BitLength_js_1.BitLength.vendorId),
                      BitLength_js_1.BitLength.vendorId
                    );
                    if (((n += BitLength_js_1.BitLength.vendorId), B)) {
                      var h = IntEncoder_js_1.IntEncoder.decode(
                        e.substr(n, BitLength_js_1.BitLength.vendorId),
                        BitLength_js_1.BitLength.vendorId
                      );
                      if (((n += BitLength_js_1.BitLength.vendorId), h < g))
                        throw new index_js_1.DecodingError(
                          "Invalid RangeEntry: endVendorId "
                            .concat(h, " is less than ")
                            .concat(g)
                        );
                      for (var L = g; L <= h; L++) t.add(L, d);
                    } else t.add(g, d);
                  }
                }
                return (t.bitLength = n), t;
              }),
              e
            );
          })();
        exports.PurposeRestrictionVectorEncoder =
          PurposeRestrictionVectorEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VectorEncodingType.js":
      /*!**************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VectorEncodingType.js ***!
  \**************************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var VectorEncodingType;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.VectorEncodingType = void 0),
          (function (e) {
            (e[(e.FIELD = 0)] = "FIELD"), (e[(e.RANGE = 1)] = "RANGE");
          })(
            (VectorEncodingType =
              exports.VectorEncodingType || (exports.VectorEncodingType = {}))
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VendorVectorEncoder.js":
      /*!***************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VendorVectorEncoder.js ***!
  \***************************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.VendorVectorEncoder = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          index_js_2 = __webpack_require__(
            /*! ../index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/index.js"
          ),
          IntEncoder_js_1 = __webpack_require__(
            /*! ./IntEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js"
          ),
          BooleanEncoder_js_1 = __webpack_require__(
            /*! ./BooleanEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/BooleanEncoder.js"
          ),
          FixedVectorEncoder_js_1 = __webpack_require__(
            /*! ./FixedVectorEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FixedVectorEncoder.js"
          ),
          VectorEncodingType_js_1 = __webpack_require__(
            /*! ./VectorEncodingType.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VectorEncodingType.js"
          ),
          index_js_3 = __webpack_require__(
            /*! ../../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          VendorVectorEncoder = (function () {
            function e() {}
            return (
              (e.encode = function (e) {
                var n,
                  d = [],
                  r = [],
                  t = IntEncoder_js_1.IntEncoder.encode(
                    e.maxId,
                    index_js_2.BitLength.maxId
                  ),
                  o = "",
                  i =
                    index_js_2.BitLength.maxId +
                    index_js_2.BitLength.encodingType,
                  _ = i + e.maxId,
                  s =
                    2 * index_js_2.BitLength.vendorId +
                    index_js_2.BitLength.singleOrRange +
                    index_js_2.BitLength.numEntries,
                  c = i + index_js_2.BitLength.numEntries;
                return (
                  e.forEach(function (t, i) {
                    ((o += BooleanEncoder_js_1.BooleanEncoder.encode(t)),
                    (n = e.maxId > s && c < _) && t) &&
                      (e.has(i + 1)
                        ? 0 === r.length &&
                          (r.push(i),
                          (c += index_js_2.BitLength.singleOrRange),
                          (c += index_js_2.BitLength.vendorId))
                        : (r.push(i),
                          (c += index_js_2.BitLength.vendorId),
                          d.push(r),
                          (r = [])));
                  }),
                  n
                    ? ((t += String(
                        VectorEncodingType_js_1.VectorEncodingType.RANGE
                      )),
                      (t += this.buildRangeEncoding(d)))
                    : ((t += String(
                        VectorEncodingType_js_1.VectorEncodingType.FIELD
                      )),
                      (t += o)),
                  t
                );
              }),
              (e.decode = function (e, n) {
                var d,
                  r = 0,
                  t = IntEncoder_js_1.IntEncoder.decode(
                    e.substr(r, index_js_2.BitLength.maxId),
                    index_js_2.BitLength.maxId
                  );
                r += index_js_2.BitLength.maxId;
                var o = IntEncoder_js_1.IntEncoder.decode(
                  e.charAt(r),
                  index_js_2.BitLength.encodingType
                );
                if (
                  ((r += index_js_2.BitLength.encodingType),
                  o === VectorEncodingType_js_1.VectorEncodingType.RANGE)
                ) {
                  if (((d = new index_js_1.Vector()), 1 === n)) {
                    if ("1" === e.substr(r, 1))
                      throw new index_js_3.DecodingError(
                        "Unable to decode default consent=1"
                      );
                    r++;
                  }
                  var i = IntEncoder_js_1.IntEncoder.decode(
                    e.substr(r, index_js_2.BitLength.numEntries),
                    index_js_2.BitLength.numEntries
                  );
                  r += index_js_2.BitLength.numEntries;
                  for (var _ = 0; _ < i; _++) {
                    var s = BooleanEncoder_js_1.BooleanEncoder.decode(
                      e.charAt(r)
                    );
                    r += index_js_2.BitLength.singleOrRange;
                    var c = IntEncoder_js_1.IntEncoder.decode(
                      e.substr(r, index_js_2.BitLength.vendorId),
                      index_js_2.BitLength.vendorId
                    );
                    if (((r += index_js_2.BitLength.vendorId), s)) {
                      var j = IntEncoder_js_1.IntEncoder.decode(
                        e.substr(r, index_js_2.BitLength.vendorId),
                        index_js_2.BitLength.vendorId
                      );
                      r += index_js_2.BitLength.vendorId;
                      for (var E = c; E <= j; E++) d.set(E);
                    } else d.set(c);
                  }
                } else {
                  var g = e.substr(r, t);
                  (r += t),
                    (d = FixedVectorEncoder_js_1.FixedVectorEncoder.decode(
                      g,
                      t
                    ));
                }
                return (d.bitLength = r), d;
              }),
              (e.buildRangeEncoding = function (e) {
                var n = e.length,
                  d = IntEncoder_js_1.IntEncoder.encode(
                    n,
                    index_js_2.BitLength.numEntries
                  );
                return (
                  e.forEach(function (e) {
                    var n = 1 === e.length;
                    (d += BooleanEncoder_js_1.BooleanEncoder.encode(!n)),
                      (d += IntEncoder_js_1.IntEncoder.encode(
                        e[0],
                        index_js_2.BitLength.vendorId
                      )),
                      n ||
                        (d += IntEncoder_js_1.IntEncoder.encode(
                          e[1],
                          index_js_2.BitLength.vendorId
                        ));
                  }),
                  d
                );
              }),
              e
            );
          })();
        exports.VendorVectorEncoder = VendorVectorEncoder;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/index.js":
      /*!*************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/index.js ***!
  \*************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, r, t, o) {
                  void 0 === o && (o = t);
                  var i = Object.getOwnPropertyDescriptor(r, t);
                  (i &&
                    !("get" in i
                      ? !r.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return r[t];
                      },
                    }),
                    Object.defineProperty(e, o, i);
                }
              : function (e, r, t, o) {
                  void 0 === o && (o = t), (e[o] = r[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, r) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(r, t) ||
                  __createBinding(r, e, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./BooleanEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/BooleanEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./DateEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/DateEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./FieldEncoderMap.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FieldEncoderMap.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./FixedVectorEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/FixedVectorEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./IntEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/IntEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./LangEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/LangEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./PurposeRestrictionVectorEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/PurposeRestrictionVectorEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./VectorEncodingType.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VectorEncodingType.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./VendorVectorEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/VendorVectorEncoder.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/index.js":
      /*!*******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/index.js ***!
  \*******************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, r, t, i) {
                  void 0 === i && (i = t);
                  var o = Object.getOwnPropertyDescriptor(r, t);
                  (o &&
                    !("get" in o
                      ? !r.__esModule
                      : o.writable || o.configurable)) ||
                    (o = {
                      enumerable: !0,
                      get: function () {
                        return r[t];
                      },
                    }),
                    Object.defineProperty(e, i, o);
                }
              : function (e, r, t, i) {
                  void 0 === i && (i = t), (e[i] = r[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, r) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(r, t) ||
                  __createBinding(r, e, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./Base64Url.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/Base64Url.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./BitLength.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/BitLength.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./EncodingOptions.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/EncodingOptions.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./SegmentEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/SegmentEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./SemanticPreEncoder.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/SemanticPreEncoder.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./field/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/field/index.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./sequence/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/index.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/FieldSequence.js":
      /*!************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/FieldSequence.js ***!
  \************************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FieldSequence = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          FieldSequence = function () {
            var e, s;
            (this[1] =
              (((e = {})[index_js_1.Segment.CORE] = [
                index_js_1.Fields.version,
                index_js_1.Fields.created,
                index_js_1.Fields.lastUpdated,
                index_js_1.Fields.cmpId,
                index_js_1.Fields.cmpVersion,
                index_js_1.Fields.consentScreen,
                index_js_1.Fields.consentLanguage,
                index_js_1.Fields.vendorListVersion,
                index_js_1.Fields.purposeConsents,
                index_js_1.Fields.vendorConsents,
              ]),
              e)),
              (this[2] =
                (((s = {})[index_js_1.Segment.CORE] = [
                  index_js_1.Fields.version,
                  index_js_1.Fields.created,
                  index_js_1.Fields.lastUpdated,
                  index_js_1.Fields.cmpId,
                  index_js_1.Fields.cmpVersion,
                  index_js_1.Fields.consentScreen,
                  index_js_1.Fields.consentLanguage,
                  index_js_1.Fields.vendorListVersion,
                  index_js_1.Fields.policyVersion,
                  index_js_1.Fields.isServiceSpecific,
                  index_js_1.Fields.useNonStandardTexts,
                  index_js_1.Fields.specialFeatureOptins,
                  index_js_1.Fields.purposeConsents,
                  index_js_1.Fields.purposeLegitimateInterests,
                  index_js_1.Fields.purposeOneTreatment,
                  index_js_1.Fields.publisherCountryCode,
                  index_js_1.Fields.vendorConsents,
                  index_js_1.Fields.vendorLegitimateInterests,
                  index_js_1.Fields.publisherRestrictions,
                ]),
                (s[index_js_1.Segment.PUBLISHER_TC] = [
                  index_js_1.Fields.publisherConsents,
                  index_js_1.Fields.publisherLegitimateInterests,
                  index_js_1.Fields.numCustomPurposes,
                  index_js_1.Fields.publisherCustomConsents,
                  index_js_1.Fields.publisherCustomLegitimateInterests,
                ]),
                (s[index_js_1.Segment.VENDORS_ALLOWED] = [
                  index_js_1.Fields.vendorsAllowed,
                ]),
                (s[index_js_1.Segment.VENDORS_DISCLOSED] = [
                  index_js_1.Fields.vendorsDisclosed,
                ]),
                s));
          };
        exports.FieldSequence = FieldSequence;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/SegmentSequence.js":
      /*!**************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/SegmentSequence.js ***!
  \**************************************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SegmentSequence = void 0);
        var index_js_1 = __webpack_require__(
            /*! ../../model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
          ),
          SegmentSequence = function (e, s) {
            if (
              ((this[1] = [index_js_1.Segment.CORE]),
              (this[2] = [index_js_1.Segment.CORE]),
              2 === e.version)
            )
              if (e.isServiceSpecific)
                this[2].push(index_js_1.Segment.PUBLISHER_TC);
              else {
                var i = !(!s || !s.isForVendors);
                (i && !0 !== e[index_js_1.Fields.supportOOB]) ||
                  this[2].push(index_js_1.Segment.VENDORS_DISCLOSED),
                  i &&
                    (e[index_js_1.Fields.supportOOB] &&
                      e[index_js_1.Fields.vendorsAllowed].size > 0 &&
                      this[2].push(index_js_1.Segment.VENDORS_ALLOWED),
                    this[2].push(index_js_1.Segment.PUBLISHER_TC));
              }
          };
        exports.SegmentSequence = SegmentSequence;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/SequenceVersionMap.js":
      /*!*****************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/SequenceVersionMap.js ***!
  \*****************************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/index.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/index.js ***!
  \****************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, i) {
                  void 0 === i && (i = r);
                  var n = Object.getOwnPropertyDescriptor(t, r);
                  (n &&
                    !("get" in n
                      ? !t.__esModule
                      : n.writable || n.configurable)) ||
                    (n = {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    }),
                    Object.defineProperty(e, i, n);
                }
              : function (e, t, r, i) {
                  void 0 === i && (i = r), (e[i] = t[r]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  __createBinding(t, e, r);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./FieldSequence.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/FieldSequence.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./SegmentSequence.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/SegmentSequence.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./SequenceVersionMap.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/sequence/SequenceVersionMap.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/DecodingError.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/errors/DecodingError.js ***!
  \**************************************************************************/
      /***/ function (__unused_webpack_module, exports) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var r = function (t, o) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (r, t) {
                    r.__proto__ = t;
                  }) ||
                function (r, t) {
                  for (var o in t)
                    Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
                })(t, o);
            };
            return function (t, o) {
              if ("function" != typeof o && null !== o)
                throw new TypeError(
                  "Class extends value " +
                    String(o) +
                    " is not a constructor or null"
                );
              function e() {
                this.constructor = t;
              }
              r(t, o),
                (t.prototype =
                  null === o
                    ? Object.create(o)
                    : ((e.prototype = o.prototype), new e()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DecodingError = void 0);
        var DecodingError = (function (r) {
          function t(t) {
            var o = r.call(this, t) || this;
            return (o.name = "DecodingError"), o;
          }
          return __extends(t, r), t;
        })(Error);
        exports.DecodingError = DecodingError;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/EncodingError.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/errors/EncodingError.js ***!
  \**************************************************************************/
      /***/ function (__unused_webpack_module, exports) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var r = function (t, o) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (r, t) {
                    r.__proto__ = t;
                  }) ||
                function (r, t) {
                  for (var o in t)
                    Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
                })(t, o);
            };
            return function (t, o) {
              if ("function" != typeof o && null !== o)
                throw new TypeError(
                  "Class extends value " +
                    String(o) +
                    " is not a constructor or null"
                );
              function n() {
                this.constructor = t;
              }
              r(t, o),
                (t.prototype =
                  null === o
                    ? Object.create(o)
                    : ((n.prototype = o.prototype), new n()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.EncodingError = void 0);
        var EncodingError = (function (r) {
          function t(t) {
            var o = r.call(this, t) || this;
            return (o.name = "EncodingError"), o;
          }
          return __extends(t, r), t;
        })(Error);
        exports.EncodingError = EncodingError;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/GVLError.js":
      /*!*********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/errors/GVLError.js ***!
  \*********************************************************************/
      /***/ function (__unused_webpack_module, exports) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var r = function (t, o) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (r, t) {
                    r.__proto__ = t;
                  }) ||
                function (r, t) {
                  for (var o in t)
                    Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
                })(t, o);
            };
            return function (t, o) {
              if ("function" != typeof o && null !== o)
                throw new TypeError(
                  "Class extends value " +
                    String(o) +
                    " is not a constructor or null"
                );
              function e() {
                this.constructor = t;
              }
              r(t, o),
                (t.prototype =
                  null === o
                    ? Object.create(o)
                    : ((e.prototype = o.prototype), new e()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.GVLError = void 0);
        var GVLError = (function (r) {
          function t(t) {
            var o = r.call(this, t) || this;
            return (o.name = "GVLError"), o;
          }
          return __extends(t, r), t;
        })(Error);
        exports.GVLError = GVLError;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/TCModelError.js":
      /*!*************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/errors/TCModelError.js ***!
  \*************************************************************************/
      /***/ function (__unused_webpack_module, exports) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var r = function (t, o) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (r, t) {
                    r.__proto__ = t;
                  }) ||
                function (r, t) {
                  for (var o in t)
                    Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
                })(t, o);
            };
            return function (t, o) {
              if ("function" != typeof o && null !== o)
                throw new TypeError(
                  "Class extends value " +
                    String(o) +
                    " is not a constructor or null"
                );
              function e() {
                this.constructor = t;
              }
              r(t, o),
                (t.prototype =
                  null === o
                    ? Object.create(o)
                    : ((e.prototype = o.prototype), new e()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TCModelError = void 0);
        var TCModelError = (function (r) {
          function t(t, o, e) {
            void 0 === e && (e = "");
            var n =
              r.call(
                this,
                "invalid value "
                  .concat(o, " passed for ")
                  .concat(t, " ")
                  .concat(e)
              ) || this;
            return (n.name = "TCModelError"), n;
          }
          return __extends(t, r), t;
        })(Error);
        exports.TCModelError = TCModelError;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js":
      /*!******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js ***!
  \******************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (r, e, t, o) {
                  void 0 === o && (o = t);
                  var i = Object.getOwnPropertyDescriptor(e, t);
                  (i &&
                    !("get" in i
                      ? !e.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return e[t];
                      },
                    }),
                    Object.defineProperty(r, o, i);
                }
              : function (r, e, t, o) {
                  void 0 === o && (o = t), (r[o] = e[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (r, e) {
              for (var t in r)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(e, t) ||
                  __createBinding(e, r, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./DecodingError.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/DecodingError.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./EncodingError.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/EncodingError.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./GVLError.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/GVLError.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./TCModelError.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/TCModelError.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/index.js":
      /*!***********************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/index.js ***!
  \***********************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, r, t, o) {
                  void 0 === o && (o = t);
                  var i = Object.getOwnPropertyDescriptor(r, t);
                  (i &&
                    !("get" in i
                      ? !r.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return r[t];
                      },
                    }),
                    Object.defineProperty(e, o, i);
                }
              : function (e, r, t, o) {
                  void 0 === o && (o = t), (e[o] = r[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, r) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(r, t) ||
                  __createBinding(r, e, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./encoder/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/encoder/index.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./model/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Cloneable.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./GVL.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/GVL.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Json.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Json.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./TCModel.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/TCModel.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./TCString.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/TCString.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/ConsentLanguages.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/ConsentLanguages.js ***!
  \****************************************************************************/
      /***/ function (__unused_webpack_module, exports) {
        "use strict";
        var __values =
          (this && this.__values) ||
          function (e) {
            var t = "function" == typeof Symbol && Symbol.iterator,
              n = t && e[t],
              r = 0;
            if (n) return n.call(e);
            if (e && "number" == typeof e.length)
              return {
                next: function () {
                  return (
                    e && r >= e.length && (e = void 0),
                    { value: e && e[r++], done: !e }
                  );
                },
              };
            throw new TypeError(
              t ? "Object is not iterable." : "Symbol.iterator is not defined."
            );
          };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ConsentLanguages = void 0);
        var ConsentLanguages = (function () {
          function e() {}
          return (
            (e.prototype.has = function (t) {
              return e.langSet.has(t);
            }),
            (e.prototype.parseLanguage = function (t) {
              var n,
                r,
                o = (t = t.toUpperCase()).split("-")[0];
              if (t.length >= 2 && 2 == o.length) {
                if (e.langSet.has(t)) return t;
                if (e.langSet.has(o)) return o;
                var a = o + "-" + o;
                if (e.langSet.has(a)) return a;
                try {
                  for (
                    var u = __values(e.langSet), i = u.next();
                    !i.done;
                    i = u.next()
                  ) {
                    var l = i.value;
                    if (-1 !== l.indexOf(t) || -1 !== l.indexOf(o)) return l;
                  }
                } catch (e) {
                  n = { error: e };
                } finally {
                  try {
                    i && !i.done && (r = u.return) && r.call(u);
                  } finally {
                    if (n) throw n.error;
                  }
                }
              }
              throw new Error("unsupported language ".concat(t));
            }),
            (e.prototype.forEach = function (t) {
              e.langSet.forEach(t);
            }),
            Object.defineProperty(e.prototype, "size", {
              get: function () {
                return e.langSet.size;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (e.langSet = new Set([
              "AR",
              "BG",
              "BS",
              "CA",
              "CS",
              "CY",
              "DA",
              "DE",
              "EL",
              "EN",
              "ES",
              "ET",
              "EU",
              "FI",
              "FR",
              "GL",
              "HE",
              "HI",
              "HR",
              "HU",
              "ID",
              "IT",
              "JA",
              "KA",
              "KO",
              "LT",
              "LV",
              "MK",
              "MS",
              "MT",
              "NL",
              "NO",
              "PL",
              "PT-BR",
              "PT-PT",
              "RO",
              "RU",
              "SK",
              "SL",
              "SQ",
              "SR-LATN",
              "SR-CYRL",
              "SV",
              "SW",
              "TH",
              "TL",
              "TR",
              "UK",
              "VI",
              "ZH",
              "ZH-HANT",
            ])),
            e
          );
        })();
        exports.ConsentLanguages = ConsentLanguages;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/DeviceDisclosure.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/DeviceDisclosure.js ***!
  \****************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/DeviceDisclosureStorageAccessType.js":
      /*!*********************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/DeviceDisclosureStorageAccessType.js ***!
  \*********************************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var DeviceDisclosureStorageAccessType;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DeviceDisclosureStorageAccessType = void 0),
          (function (e) {
            (e.COOKIE = "cookie"), (e.WEB = "web"), (e.APP = "app");
          })(
            (DeviceDisclosureStorageAccessType =
              exports.DeviceDisclosureStorageAccessType ||
              (exports.DeviceDisclosureStorageAccessType = {}))
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Fields.js":
      /*!******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/Fields.js ***!
  \******************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Fields = void 0);
        var Fields = (function () {
          function e() {}
          return (
            (e.cmpId = "cmpId"),
            (e.cmpVersion = "cmpVersion"),
            (e.consentLanguage = "consentLanguage"),
            (e.consentScreen = "consentScreen"),
            (e.created = "created"),
            (e.supportOOB = "supportOOB"),
            (e.isServiceSpecific = "isServiceSpecific"),
            (e.lastUpdated = "lastUpdated"),
            (e.numCustomPurposes = "numCustomPurposes"),
            (e.policyVersion = "policyVersion"),
            (e.publisherCountryCode = "publisherCountryCode"),
            (e.publisherCustomConsents = "publisherCustomConsents"),
            (e.publisherCustomLegitimateInterests =
              "publisherCustomLegitimateInterests"),
            (e.publisherLegitimateInterests = "publisherLegitimateInterests"),
            (e.publisherConsents = "publisherConsents"),
            (e.publisherRestrictions = "publisherRestrictions"),
            (e.purposeConsents = "purposeConsents"),
            (e.purposeLegitimateInterests = "purposeLegitimateInterests"),
            (e.purposeOneTreatment = "purposeOneTreatment"),
            (e.specialFeatureOptins = "specialFeatureOptins"),
            (e.useNonStandardTexts = "useNonStandardTexts"),
            (e.vendorConsents = "vendorConsents"),
            (e.vendorLegitimateInterests = "vendorLegitimateInterests"),
            (e.vendorListVersion = "vendorListVersion"),
            (e.vendorsAllowed = "vendorsAllowed"),
            (e.vendorsDisclosed = "vendorsDisclosed"),
            (e.version = "version"),
            e
          );
        })();
        exports.Fields = Fields;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/IntMap.js":
      /*!******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/IntMap.js ***!
  \******************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/KeyMap.js":
      /*!******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/KeyMap.js ***!
  \******************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/PurposeRestriction.js":
      /*!******************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/PurposeRestriction.js ***!
  \******************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
          (this && this.__extends) ||
          (function () {
            var e = function (t, r) {
              return (e =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, t) {
                    e.__proto__ = t;
                  }) ||
                function (e, t) {
                  for (var r in t)
                    Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                })(t, r);
            };
            return function (t, r) {
              if ("function" != typeof r && null !== r)
                throw new TypeError(
                  "Class extends value " +
                    String(r) +
                    " is not a constructor or null"
                );
              function o() {
                this.constructor = t;
              }
              e(t, r),
                (t.prototype =
                  null === r
                    ? Object.create(r)
                    : ((o.prototype = r.prototype), new o()));
            };
          })();
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PurposeRestriction = void 0);
        var Cloneable_js_1 = __webpack_require__(
            /*! ../Cloneable.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          RestrictionType_js_1 = __webpack_require__(
            /*! ./RestrictionType.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/RestrictionType.js"
          ),
          PurposeRestriction = (function (e) {
            function t(t, r) {
              var o = e.call(this) || this;
              return (
                void 0 !== t && (o.purposeId = t),
                void 0 !== r && (o.restrictionType = r),
                o
              );
            }
            return (
              __extends(t, e),
              (t.unHash = function (e) {
                var r = e.split(this.hashSeparator),
                  o = new t();
                if (2 !== r.length)
                  throw new index_js_1.TCModelError("hash", e);
                return (
                  (o.purposeId = parseInt(r[0], 10)),
                  (o.restrictionType = parseInt(r[1], 10)),
                  o
                );
              }),
              Object.defineProperty(t.prototype, "hash", {
                get: function () {
                  if (!this.isValid())
                    throw new Error("cannot hash invalid PurposeRestriction");
                  return ""
                    .concat(this.purposeId)
                    .concat(t.hashSeparator)
                    .concat(this.restrictionType);
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "purposeId", {
                get: function () {
                  return this.purposeId_;
                },
                set: function (e) {
                  this.purposeId_ = e;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.isValid = function () {
                return (
                  Number.isInteger(this.purposeId) &&
                  this.purposeId > 0 &&
                  (this.restrictionType ===
                    RestrictionType_js_1.RestrictionType.NOT_ALLOWED ||
                    this.restrictionType ===
                      RestrictionType_js_1.RestrictionType.REQUIRE_CONSENT ||
                    this.restrictionType ===
                      RestrictionType_js_1.RestrictionType.REQUIRE_LI)
                );
              }),
              (t.prototype.isSameAs = function (e) {
                return (
                  this.purposeId === e.purposeId &&
                  this.restrictionType === e.restrictionType
                );
              }),
              (t.hashSeparator = "-"),
              t
            );
          })(Cloneable_js_1.Cloneable);
        exports.PurposeRestriction = PurposeRestriction;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/PurposeRestrictionVector.js":
      /*!************************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/PurposeRestrictionVector.js ***!
  \************************************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
            (this && this.__extends) ||
            (function () {
              var t = function (e, r) {
                return (t =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                      t.__proto__ = e;
                    }) ||
                  function (t, e) {
                    for (var r in e)
                      Object.prototype.hasOwnProperty.call(e, r) &&
                        (t[r] = e[r]);
                  })(e, r);
              };
              return function (e, r) {
                if ("function" != typeof r && null !== r)
                  throw new TypeError(
                    "Class extends value " +
                      String(r) +
                      " is not a constructor or null"
                  );
                function o() {
                  this.constructor = e;
                }
                t(e, r),
                  (e.prototype =
                    null === r
                      ? Object.create(r)
                      : ((o.prototype = r.prototype), new o()));
              };
            })(),
          __read =
            (this && this.__read) ||
            function (t, e) {
              var r = "function" == typeof Symbol && t[Symbol.iterator];
              if (!r) return t;
              var o,
                s,
                i = r.call(t),
                n = [];
              try {
                for (; (void 0 === e || e-- > 0) && !(o = i.next()).done; )
                  n.push(o.value);
              } catch (t) {
                s = { error: t };
              } finally {
                try {
                  o && !o.done && (r = i.return) && r.call(i);
                } finally {
                  if (s) throw s.error;
                }
              }
              return n;
            },
          __spreadArray =
            (this && this.__spreadArray) ||
            function (t, e, r) {
              if (r || 2 === arguments.length)
                for (var o, s = 0, i = e.length; s < i; s++)
                  (!o && s in e) ||
                    (o || (o = Array.prototype.slice.call(e, 0, s)),
                    (o[s] = e[s]));
              return t.concat(o || Array.prototype.slice.call(e));
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PurposeRestrictionVector = void 0);
        var PurposeRestriction_js_1 = __webpack_require__(
            /*! ./PurposeRestriction.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/PurposeRestriction.js"
          ),
          RestrictionType_js_1 = __webpack_require__(
            /*! ./RestrictionType.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/RestrictionType.js"
          ),
          Cloneable_js_1 = __webpack_require__(
            /*! ../Cloneable.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js"
          ),
          PurposeRestrictionVector = (function (t) {
            function e() {
              var e = (null !== t && t.apply(this, arguments)) || this;
              return (e.bitLength = 0), (e.map = new Map()), e;
            }
            return (
              __extends(e, t),
              (e.prototype.has = function (t) {
                return this.map.has(t);
              }),
              (e.prototype.isOkToHave = function (t, e, r) {
                var o,
                  s = !0;
                if (
                  null === (o = this.gvl) || void 0 === o ? void 0 : o.vendors
                ) {
                  var i = this.gvl.vendors[r];
                  if (i)
                    if (t === RestrictionType_js_1.RestrictionType.NOT_ALLOWED)
                      s =
                        i.legIntPurposes.includes(e) || i.purposes.includes(e);
                    else if (i.flexiblePurposes.length)
                      switch (t) {
                        case RestrictionType_js_1.RestrictionType
                          .REQUIRE_CONSENT:
                          s =
                            i.flexiblePurposes.includes(e) &&
                            i.legIntPurposes.includes(e);
                          break;
                        case RestrictionType_js_1.RestrictionType.REQUIRE_LI:
                          s =
                            i.flexiblePurposes.includes(e) &&
                            i.purposes.includes(e);
                      }
                    else s = !1;
                  else s = !1;
                }
                return s;
              }),
              (e.prototype.add = function (t, e) {
                if (this.isOkToHave(e.restrictionType, e.purposeId, t)) {
                  var r = e.hash;
                  this.has(r) ||
                    (this.map.set(r, new Set()), (this.bitLength = 0)),
                    this.map.get(r).add(t);
                }
              }),
              (e.prototype.restrictPurposeToLegalBasis = function (t) {
                var e = Array.from(this.gvl.vendorIds),
                  r = t.hash,
                  o = e[e.length - 1],
                  s = __spreadArray([], __read(Array(o).keys()), !1).map(
                    function (t) {
                      return t + 1;
                    }
                  );
                if (this.has(r))
                  for (var i = 1; i <= o; i++) this.map.get(r).add(i);
                else this.map.set(r, new Set(s)), (this.bitLength = 0);
              }),
              (e.prototype.getVendors = function (t) {
                var e = [];
                if (t) {
                  var r = t.hash;
                  this.has(r) && (e = Array.from(this.map.get(r)));
                } else {
                  var o = new Set();
                  this.map.forEach(function (t) {
                    t.forEach(function (t) {
                      o.add(t);
                    });
                  }),
                    (e = Array.from(o));
                }
                return e.sort(function (t, e) {
                  return t - e;
                });
              }),
              (e.prototype.getRestrictionType = function (t, e) {
                var r;
                return (
                  this.getRestrictions(t).forEach(function (t) {
                    t.purposeId === e &&
                      (void 0 === r || r > t.restrictionType) &&
                      (r = t.restrictionType);
                  }),
                  r
                );
              }),
              (e.prototype.vendorHasRestriction = function (t, e) {
                for (
                  var r = !1, o = this.getRestrictions(t), s = 0;
                  s < o.length && !r;
                  s++
                )
                  r = e.isSameAs(o[s]);
                return r;
              }),
              (e.prototype.getMaxVendorId = function () {
                var t = 0;
                return (
                  this.map.forEach(function (e) {
                    t = Math.max(Array.from(e)[e.size - 1], t);
                  }),
                  t
                );
              }),
              (e.prototype.getRestrictions = function (t) {
                var e = [];
                return (
                  this.map.forEach(function (r, o) {
                    t
                      ? r.has(t) &&
                        e.push(
                          PurposeRestriction_js_1.PurposeRestriction.unHash(o)
                        )
                      : e.push(
                          PurposeRestriction_js_1.PurposeRestriction.unHash(o)
                        );
                  }),
                  e
                );
              }),
              (e.prototype.getPurposes = function () {
                var t = new Set();
                return (
                  this.map.forEach(function (e, r) {
                    t.add(
                      PurposeRestriction_js_1.PurposeRestriction.unHash(r)
                        .purposeId
                    );
                  }),
                  Array.from(t)
                );
              }),
              (e.prototype.remove = function (t, e) {
                var r = e.hash,
                  o = this.map.get(r);
                o &&
                  (o.delete(t),
                  0 == o.size && (this.map.delete(r), (this.bitLength = 0)));
              }),
              Object.defineProperty(e.prototype, "gvl", {
                get: function () {
                  return this.gvl_;
                },
                set: function (t) {
                  var e = this;
                  this.gvl_ ||
                    ((this.gvl_ = t),
                    this.map.forEach(function (t, r) {
                      var o =
                        PurposeRestriction_js_1.PurposeRestriction.unHash(r);
                      Array.from(t).forEach(function (r) {
                        e.isOkToHave(o.restrictionType, o.purposeId, r) ||
                          t.delete(r);
                      });
                    }));
                },
                enumerable: !1,
                configurable: !0,
              }),
              (e.prototype.isEmpty = function () {
                return 0 === this.map.size;
              }),
              Object.defineProperty(e.prototype, "numRestrictions", {
                get: function () {
                  return this.map.size;
                },
                enumerable: !1,
                configurable: !0,
              }),
              e
            );
          })(Cloneable_js_1.Cloneable);
        exports.PurposeRestrictionVector = PurposeRestrictionVector;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/RestrictionType.js":
      /*!***************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/RestrictionType.js ***!
  \***************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var RestrictionType;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.RestrictionType = void 0),
          (function (e) {
            (e[(e.NOT_ALLOWED = 0)] = "NOT_ALLOWED"),
              (e[(e.REQUIRE_CONSENT = 1)] = "REQUIRE_CONSENT"),
              (e[(e.REQUIRE_LI = 2)] = "REQUIRE_LI");
          })(
            (RestrictionType =
              exports.RestrictionType || (exports.RestrictionType = {}))
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Segment.js":
      /*!*******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/Segment.js ***!
  \*******************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        var Segment;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Segment = void 0),
          (function (e) {
            (e.CORE = "core"),
              (e.VENDORS_DISCLOSED = "vendorsDisclosed"),
              (e.VENDORS_ALLOWED = "vendorsAllowed"),
              (e.PUBLISHER_TC = "publisherTC");
          })((Segment = exports.Segment || (exports.Segment = {})));

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/SegmentIDs.js":
      /*!**********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/SegmentIDs.js ***!
  \**********************************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";
        var _a;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SegmentIDs = void 0);
        var Segment_js_1 = __webpack_require__(
            /*! ./Segment.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Segment.js"
          ),
          SegmentIDs = (function () {
            function e() {}
            return (
              (e.ID_TO_KEY = [
                Segment_js_1.Segment.CORE,
                Segment_js_1.Segment.VENDORS_DISCLOSED,
                Segment_js_1.Segment.VENDORS_ALLOWED,
                Segment_js_1.Segment.PUBLISHER_TC,
              ]),
              (e.KEY_TO_ID =
                (((_a = {})[Segment_js_1.Segment.CORE] = 0),
                (_a[Segment_js_1.Segment.VENDORS_DISCLOSED] = 1),
                (_a[Segment_js_1.Segment.VENDORS_ALLOWED] = 2),
                (_a[Segment_js_1.Segment.PUBLISHER_TC] = 3),
                _a)),
              e
            );
          })();
        exports.SegmentIDs = SegmentIDs;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Vector.js":
      /*!******************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/Vector.js ***!
  \******************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __extends =
            (this && this.__extends) ||
            (function () {
              var t = function (e, r) {
                return (t =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                      t.__proto__ = e;
                    }) ||
                  function (t, e) {
                    for (var r in e)
                      Object.prototype.hasOwnProperty.call(e, r) &&
                        (t[r] = e[r]);
                  })(e, r);
              };
              return function (e, r) {
                if ("function" != typeof r && null !== r)
                  throw new TypeError(
                    "Class extends value " +
                      String(r) +
                      " is not a constructor or null"
                  );
                function n() {
                  this.constructor = e;
                }
                t(e, r),
                  (e.prototype =
                    null === r
                      ? Object.create(r)
                      : ((n.prototype = r.prototype), new n()));
              };
            })(),
          __generator =
            (this && this.__generator) ||
            function (t, e) {
              var r,
                n,
                o,
                i,
                s = {
                  label: 0,
                  sent: function () {
                    if (1 & o[0]) throw o[1];
                    return o[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (i = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this;
                  }),
                i
              );
              function a(a) {
                return function (u) {
                  return (function (a) {
                    if (r)
                      throw new TypeError("Generator is already executing.");
                    for (; i && ((i = 0), a[0] && (s = 0)), s; )
                      try {
                        if (
                          ((r = 1),
                          n &&
                            (o =
                              2 & a[0]
                                ? n.return
                                : a[0]
                                ? n.throw || ((o = n.return) && o.call(n), 0)
                                : n.next) &&
                            !(o = o.call(n, a[1])).done)
                        )
                          return o;
                        switch (
                          ((n = 0), o && (a = [2 & a[0], o.value]), a[0])
                        ) {
                          case 0:
                          case 1:
                            o = a;
                            break;
                          case 4:
                            return s.label++, { value: a[1], done: !1 };
                          case 5:
                            s.label++, (n = a[1]), (a = [0]);
                            continue;
                          case 7:
                            (a = s.ops.pop()), s.trys.pop();
                            continue;
                          default:
                            if (
                              !((o = s.trys),
                              (o = o.length > 0 && o[o.length - 1]) ||
                                (6 !== a[0] && 2 !== a[0]))
                            ) {
                              s = 0;
                              continue;
                            }
                            if (
                              3 === a[0] &&
                              (!o || (a[1] > o[0] && a[1] < o[3]))
                            ) {
                              s.label = a[1];
                              break;
                            }
                            if (6 === a[0] && s.label < o[1]) {
                              (s.label = o[1]), (o = a);
                              break;
                            }
                            if (o && s.label < o[2]) {
                              (s.label = o[2]), s.ops.push(a);
                              break;
                            }
                            o[2] && s.ops.pop(), s.trys.pop();
                            continue;
                        }
                        a = e.call(t, s);
                      } catch (t) {
                        (a = [6, t]), (n = 0);
                      } finally {
                        r = o = 0;
                      }
                    if (5 & a[0]) throw a[1];
                    return { value: a[0] ? a[1] : void 0, done: !0 };
                  })([a, u]);
                };
              }
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Vector = void 0);
        var Cloneable_js_1 = __webpack_require__(
            /*! ../Cloneable.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/Cloneable.js"
          ),
          index_js_1 = __webpack_require__(
            /*! ../errors/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/errors/index.js"
          ),
          Vector = (function (t) {
            function e() {
              var e = (null !== t && t.apply(this, arguments)) || this;
              return (e.bitLength = 0), (e.maxId_ = 0), (e.set_ = new Set()), e;
            }
            return (
              __extends(e, t),
              (e.prototype[Symbol.iterator] = function () {
                var t;
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      (t = 1), (e.label = 1);
                    case 1:
                      return t <= this.maxId ? [4, [t, this.has(t)]] : [3, 4];
                    case 2:
                      e.sent(), (e.label = 3);
                    case 3:
                      return t++, [3, 1];
                    case 4:
                      return [2];
                  }
                });
              }),
              (e.prototype.values = function () {
                return this.set_.values();
              }),
              Object.defineProperty(e.prototype, "maxId", {
                get: function () {
                  return this.maxId_;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (e.prototype.has = function (t) {
                return this.set_.has(t);
              }),
              (e.prototype.unset = function (t) {
                var e = this;
                Array.isArray(t)
                  ? t.forEach(function (t) {
                      return e.unset(t);
                    })
                  : "object" == typeof t
                  ? this.unset(
                      Object.keys(t).map(function (t) {
                        return Number(t);
                      })
                    )
                  : (this.set_.delete(Number(t)),
                    (this.bitLength = 0),
                    t === this.maxId &&
                      ((this.maxId_ = 0),
                      this.set_.forEach(function (t) {
                        e.maxId_ = Math.max(e.maxId, t);
                      })));
              }),
              (e.prototype.isIntMap = function (t) {
                var e = this,
                  r = "object" == typeof t;
                return (r =
                  r &&
                  Object.keys(t).every(function (r) {
                    var n = Number.isInteger(parseInt(r, 10));
                    return (n =
                      (n = n && e.isValidNumber(t[r].id)) &&
                      void 0 !== t[r].name);
                  }));
              }),
              (e.prototype.isValidNumber = function (t) {
                return parseInt(t, 10) > 0;
              }),
              (e.prototype.isSet = function (t) {
                var e = !1;
                return (
                  t instanceof Set &&
                    (e = Array.from(t).every(this.isValidNumber)),
                  e
                );
              }),
              (e.prototype.set = function (t) {
                var e = this;
                if (Array.isArray(t))
                  t.forEach(function (t) {
                    return e.set(t);
                  });
                else if (this.isSet(t)) this.set(Array.from(t));
                else if (this.isIntMap(t))
                  this.set(
                    Object.keys(t).map(function (t) {
                      return Number(t);
                    })
                  );
                else {
                  if (!this.isValidNumber(t))
                    throw new index_js_1.TCModelError(
                      "set()",
                      t,
                      "must be positive integer array, positive integer, Set<number>, or IntMap"
                    );
                  this.set_.add(t),
                    (this.maxId_ = Math.max(this.maxId, t)),
                    (this.bitLength = 0);
                }
              }),
              (e.prototype.empty = function () {
                this.set_ = new Set();
              }),
              (e.prototype.forEach = function (t) {
                for (var e = 1; e <= this.maxId; e++) t(this.has(e), e);
              }),
              Object.defineProperty(e.prototype, "size", {
                get: function () {
                  return this.set_.size;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (e.prototype.setAll = function (t) {
                this.set(t);
              }),
              e
            );
          })(Cloneable_js_1.Cloneable);
        exports.Vector = Vector;

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/ByPurposeVendorMap.js":
      /*!**********************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/ByPurposeVendorMap.js ***!
  \**********************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/DataCategory.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/DataCategory.js ***!
  \****************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Declarations.js":
      /*!****************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Declarations.js ***!
  \****************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Feature.js":
      /*!***********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Feature.js ***!
  \***********************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/GVLMapItem.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/GVLMapItem.js ***!
  \**************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/GvlCreationOptions.js":
      /*!**********************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/GvlCreationOptions.js ***!
  \**********************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/IDSetMap.js":
      /*!************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/IDSetMap.js ***!
  \************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Purpose.js":
      /*!***********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Purpose.js ***!
  \***********************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Stack.js":
      /*!*********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Stack.js ***!
  \*********************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Vendor.js":
      /*!**********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Vendor.js ***!
  \**********************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/VendorList.js":
      /*!**************************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/VendorList.js ***!
  \**************************************************************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/index.js":
      /*!*********************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/index.js ***!
  \*********************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, r, t, o) {
                  void 0 === o && (o = t);
                  var i = Object.getOwnPropertyDescriptor(r, t);
                  (i &&
                    !("get" in i
                      ? !r.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return r[t];
                      },
                    }),
                    Object.defineProperty(e, o, i);
                }
              : function (e, r, t, o) {
                  void 0 === o && (o = t), (e[o] = r[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, r) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(r, t) ||
                  __createBinding(r, e, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./ByPurposeVendorMap.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/ByPurposeVendorMap.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Declarations.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Declarations.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Feature.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Feature.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./GVLMapItem.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/GVLMapItem.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./IDSetMap.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/IDSetMap.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Purpose.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Purpose.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Stack.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Stack.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Vendor.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/Vendor.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./VendorList.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/VendorList.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./DataCategory.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/DataCategory.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./GvlCreationOptions.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/GvlCreationOptions.js"
            ),
            exports
          );

        /***/
      },

    /***/ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js":
      /*!*****************************************************************!*\
  !*** ./node_modules/@iabtechlabtcf/core/lib/cjs/model/index.js ***!
  \*****************************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";
        var __createBinding =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, r, t, o) {
                  void 0 === o && (o = t);
                  var s = Object.getOwnPropertyDescriptor(r, t);
                  (s &&
                    !("get" in s
                      ? !r.__esModule
                      : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return r[t];
                      },
                    }),
                    Object.defineProperty(e, o, s);
                }
              : function (e, r, t, o) {
                  void 0 === o && (o = t), (e[o] = r[t]);
                }),
          __exportStar =
            (this && this.__exportStar) ||
            function (e, r) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(r, t) ||
                  __createBinding(r, e, t);
            };
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          __exportStar(
            __webpack_require__(
              /*! ./ConsentLanguages.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/ConsentLanguages.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Fields.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Fields.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./IntMap.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/IntMap.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./KeyMap.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/KeyMap.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./PurposeRestriction.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/PurposeRestriction.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./PurposeRestrictionVector.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/PurposeRestrictionVector.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./DeviceDisclosureStorageAccessType.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/DeviceDisclosureStorageAccessType.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./DeviceDisclosure.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/DeviceDisclosure.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./RestrictionType.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/RestrictionType.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Segment.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Segment.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./SegmentIDs.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/SegmentIDs.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./Vector.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/Vector.js"
            ),
            exports
          ),
          __exportStar(
            __webpack_require__(
              /*! ./gvl/index.js */ "./node_modules/@iabtechlabtcf/core/lib/cjs/model/gvl/index.js"
            ),
            exports
          );

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*!*******************************************!*\
  !*** ./GVLTTnV2uYSvaBkRcYRFi-original.js ***!
  \*******************************************/
    window.cookieyes = window.cookieyes || {};
    const ref = window.cookieyes;
    const ckyNativeFunctions =
      (window.ckySettings && window.ckySettings.nativeFunctions) || {};
    ref._ckyFetch = (ckyNativeFunctions.fetch || window.fetch).bind(window);
    ref._ckyXHR = ckyNativeFunctions.xhr || window.XMLHttpRequest;
    Object.assign(ref._ckyStore, {
      _ruleData: {
        _countryName: "",
        _regionCode: "",
        _regionName: "",
        _euStatus: "",
        _currentLanguage: document.documentElement.lang,
        _geoIPStatus: "",
      },
      _language: {
        _store: new Map(),
        _supportedMap: {
          en: "p1c0D2M5",
          ko: "3ZTup8-e",
          lt: "tjJ97Wp9",
          pt: "p971q67S",
          "pt-br": "gDqsY1a3",
          sr: "3A8NCM6X",
          "sr-latn": "QugXfaRx",
          es: "DdlLs17I",
          tl: "Xwkl_5tu",
          th: "n3BDeSiJ",
        },
        _active: "",
        _default: "en",
        _localeMap: {
          "pt-BR": "pt-br",
        },
      },
      _banners: {
        9: "71nBA5VG",
      },
      _bannerConfig: {},
      _bannerDisplayState: "none",
      _auditTable: {
        _headerKeys: [],
      },
      _isPreview: _ckyCheckPreview(),
      _tcStringValue: "",
      _vendorDisplayStatus: false,
      _vendorToggleState: {},
    });
    let ckyElementsCacheMap = [];

    function _ckyRequest(url, method = "GET", data = null) {
      let body = null;
      const headers = {};

      if (method === "POST" && data) {
        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
      }

      return ref._ckyFetch(url, {
        method,
        headers,
        body,
      });
    }

    function _ckyGetConsentString(category) {
      return ref._ckyIsCategoryToBeBlocked(category) ? "denied" : "granted";
    }

    async function _ckyPushUETConsentData() {
      await yieldToMain();
      window.uetq.push(...arguments);
    }

    function _ckyAttachListener(selector, fn) {
      const item = _ckyFindElement(selector);

      item && _ckyAttachListenerToElement(item, fn);
    }

    function _ckyAttachListenerToElement(element, fn) {
      element.addEventListener("click", fn);
    }

    function _ckyRemoveElement(selector, removeParent = true) {
      const item = _ckyFindElement(selector, removeParent);

      item && item.remove();
    }

    function _ckyHasClass() {
      return _ckyClassAction("contains", ...arguments);
    }

    function _ckyClassAdd() {
      return _ckyClassAction("add", ...arguments);
    }

    function _ckyClassRemove() {
      return _ckyClassAction("remove", ...arguments);
    }

    function _ckyClassToggle() {
      return _ckyClassAction("toggle", ...arguments);
    }

    function _ckyClassAction(action, selector, className, forParent = true) {
      const item = _ckyFindElement(selector, forParent);

      return item && item.classList[action](className);
    }

    function _ckyInitializeElementsCacheMap() {
      ckyElementsCacheMap = new Map(
        Array.from(document.querySelectorAll("[data-cky-tag]")).map((el) => [
          el.dataset.ckyTag,
          el,
        ])
      );
    }

    function _ckyHasUserProvidedConsent() {
      return ref._ckyStore._tcStringValue !== "";
    }

    function _ckyFindElement(selector, forParent) {
      let createdSelector = selector;
      let element;

      if (ref._ckyStartsWith(selector, "=")) {
        const tag = selector.substring(1);
        element = ckyElementsCacheMap.get(tag) || null;
        if (!element) createdSelector = `[data-cky-tag="${tag}"]`;
      }

      element = element || document.querySelector(createdSelector);
      if (!element || (forParent && !element.parentElement)) return null;
      return forParent ? element.parentElement : element;
    }

    function _ckyFireEvent(eventName, data) {
      const event = new CustomEvent(eventName, {
        detail: data,
      });
      document.dispatchEvent(event);
    }

    function _ckyFindHeaders() {
      const languageDictionary = ref._ckyStore._language._store.get(
        ref._ckyStore._language._active
      );

      const headerKeys = [];

      for (const key in languageDictionary)
        if (key.includes(`cky_audit_table_header_`))
          headerKeys.push(key.replace(`cky_audit_table_header_`, ""));

      return headerKeys;
    }

    function _ckyGetValueFromMap(key, dictionary) {
      let allKeys = key.split(".");
      if (/cookies\.(.*\..*)\..*/gm.test(key))
        allKeys = [
          allKeys[0],
          allKeys.slice(1, -1).join("."),
          allKeys[allKeys.length - 1],
        ];
      return allKeys.reduce((obj, i) => (obj ? obj[i] : null), dictionary);
    }

    function _ckyGetTranslation(key) {
      const languageDictionary = ref._ckyStore._language._store.get(
        ref._ckyStore._language._active
      );

      const response = _ckyGetValueFromMap(key, languageDictionary);

      return response || "";
    }

    function _ckyPrepareHTML(htmlContent) {
      const languageDictionary = ref._ckyStore._language._store.get(
        ref._ckyStore._language._active
      );

      const keysToReplace = Object.keys(languageDictionary).reduce(
        (prev, curr) => {
          if (ref._ckyStartsWith(curr, `cky_`))
            prev[`[${curr}]`] = languageDictionary[curr] || "";
          return prev;
        },
        {}
      );
      const reToReplace = new RegExp(
        Object.keys(keysToReplace)
          .join("|")
          .replace(/[\[\]]/g, "\\$&"),
        "gi"
      );
      htmlContent = htmlContent.replace(
        reToReplace,
        (matched) => keysToReplace[matched]
      );
      return htmlContent;
    }

    function _ckyCheckPreview() {
      if (!location.search) return false;
      return location.search
        .substring(1)
        .split("&")
        .some((item) => {
          const [key, value] = item
            .split("=")
            .map((val) => decodeURIComponent(val));
          return key === "cky_preview" && value === "true";
        });
    }

    function _ckyToggleAriaExpandStatus(selector, forceDefault = null) {
      const element = _ckyFindElement(selector);

      if (!element) return;
      if (forceDefault)
        return element.setAttribute("aria-expanded", forceDefault);
      const toggleFinalValue =
        element.getAttribute("aria-expanded") === "true" ? "false" : "true";
      element.setAttribute("aria-expanded", toggleFinalValue);
    }

    function _ckyGetIntMapLength(item) {
      return Object.keys(item).length;
    }

    function _ckyReplaceKeysInText(hayStack) {
      const replaceKey = (key, value = null, treatment = 1) => {
        const processedKey =
          treatment === 1 || value === null ? `[${key}]` : key;
        hayStack = ref._ckyReplaceAll(
          hayStack,
          processedKey,
          value === null ? _ckyGetTranslation(key) : value
        );
      };

      const getFinalText = () => hayStack;

      return [replaceKey, getFinalText];
    }

    function _ckyFindItemFromShortCode(data) {
      return (key) => data.find((code) => code.key === key).content.container;
    }

    function _ckyGetItemListText(list) {
      return list.map((item) => `<li>${item.name}</li>`).join("");
    }

    function _ckyCleanNodesWithClasses(
      list,
      keyPreffix,
      selectedItemID,
      accordionClass = ".cky-accordion-btn"
    ) {
      const itemIDsWithClass = [];
      const activeClass = "cky-accordion-active";
      list.forEach((currItem) => {
        if (currItem.id === selectedItemID) return;
        const currentItemID = `#${keyPreffix}${currItem.id}`;
        if (_ckyHasClass(currentItemID, activeClass, false))
          itemIDsWithClass.push(currentItemID);
      });
      itemIDsWithClass.forEach((currItemID) => {
        _ckyClassRemove(currItemID, activeClass, false);

        _ckyToggleAriaExpandStatus(`${currItemID} ${accordionClass}`, "false");
      });
    }

    function _ckyAttachLinkToLastChild(
      shortCodeKey,
      placeHolder,
      linkKey,
      selector
    ) {
      const readMoreCode = ref._ckyStore._bannerConfig.dataShortCodes.find(
        (code) => code.key === shortCodeKey
      );

      const contentToInsert = `&nbsp;${ref
        ._ckyReplaceAll(
          readMoreCode.processedHTML,
          `[${placeHolder}]`,
          _ckyGetTranslation(placeHolder)
        )
        .replace(`href="#"`, `href="${_ckyGetTranslation(linkKey)}"`)}`;
      const readMoreElement = document.querySelector(
        `[data-cky-tag="${selector}"] p:last-child`
      );
      readMoreElement &&
        readMoreElement.insertAdjacentHTML("beforeend", contentToInsert);
    }

    function _ckyMaskIpAddress(clientIP) {
      const v4Delimiter = clientIP.lastIndexOf(".");

      if (v4Delimiter > 0) {
        clientIP = `${clientIP.substring(0, v4Delimiter)}.0`;
      } else {
        const v6Delimiter = clientIP.lastIndexOf(":");

        if (v6Delimiter > 0) {
          clientIP = `${clientIP.substring(0, v6Delimiter)}:0000`;
        }
      }

      return clientIP;
    }

    function _ckyUnblock() {
      if (navigator.doNotTrack === 1) return;

      const ckyconsent = ref._ckyGetFromStore("consent");

      if (
        ref._ckyStore._bannerConfig.activeLaw === "gdpr" &&
        (!ckyconsent || ckyconsent !== "yes") &&
        ref._ckyStore._categories.every(
          (cat) => cat.isNecessary || ref._ckyGetFromStore(cat.slug) === "no"
        )
      )
        return;
      ref._ckyStore._backupNodes = ref._ckyStore._backupNodes.filter(
        ({ position, node, uniqueID }) => {
          try {
            if (ref._ckyShouldBlockProvider(node.src)) return true;

            if (node.nodeName.toLowerCase() === "script") {
              const scriptNode = document.createElement("script");
              scriptNode.src = node.src;
              scriptNode.type = "text/javascript";
              document[position].appendChild(scriptNode);
            } else {
              const frame = document.getElementById(uniqueID);
              if (!frame) return false;
              frame.parentNode.insertBefore(node, frame);
              frame.parentNode.removeChild(frame);
            }

            return false;
          } catch (error) {
            console.error(error);
            return false;
          }
        }
      );
    }

    function _ckyClearListeners() {
      ref._nodeListObserver.disconnect();

      document.createElement = ref._ckyCreateElementBackup;
    }

    function _ckyAcceptCookies(choice = "all", isTrusted = false) {
      const { activeLaw, reloadOnAccept } = ref._ckyStore._bannerConfig;
      const doReloadOnConsent =
        reloadOnAccept && (isTrusted || window._ckyScannerBot);

      ref._ckySetInStore("action", "yes");

      ref._ckySetInStore("consent", choice === "reject" ? "no" : "yes");

      const responseCategories = {
        accepted: [],
        rejected: [],
      };

      for (const category of ref._ckyStore._categories) {
        let valueToSet =
          !category.isNecessary &&
          (choice === "reject" ||
            (choice === "custom" && !_ckyFindCheckBoxValue(category.slug)))
            ? "no"
            : "yes";

        ref._ckySetInStore(`${category.slug}`, valueToSet);

        if (valueToSet === "no") {
          responseCategories.rejected.push(category.slug);

          _ckyRemoveDeadCookies(category);
        } else responseCategories.accepted.push(category.slug);
      }

      _ckySetIABConsentState(choice);

      if (!doReloadOnConsent) {
        if (!ref._ckyStore._isPreview) _ckyLogCookies();

        _ckyUnblock();
      } else {
        if (!ref._ckyStore._isPreview) _ckyLogCookies(doReloadOnConsent);
        else location.reload();
      }

      _ckyFireEvent("cookieyes_consent_update", responseCategories);

      _ckySetUETConsentMode();

      _ckySetClarityConsentMode();

      if (activeLaw === "gdpr") _ckySetCategorySelections(false);
    }

    function _ckySetInitialState() {
      const { activeLaw, shouldFollowGPC } = ref._ckyStore._bannerConfig;

      ref._ckySetInStore(
        "consent",
        activeLaw === "ccpa" && shouldFollowGPC ? "yes" : "no"
      );

      const responseCategories = {
        accepted: [],
        rejected: [],
      };

      for (const category of ref._ckyStore._categories) {
        let valueToSet = "yes";
        if (!category.isNecessary && !category.defaultConsent[activeLaw])
          valueToSet = "no";
        if (valueToSet === "no")
          responseCategories.rejected.push(category.slug);
        else responseCategories.accepted.push(category.slug);

        ref._ckySetInStore(`${category.slug}`, valueToSet);
      }

      _ckyUnblock();

      _ckyFireEvent("cookieyes_consent_update", responseCategories);

      _ckySetUETInitialData();
    }

    function _ckyAllowAll() {
      ref._ckySetInStore("action", "no");

      ref._ckySetInStore("consent", "yes");

      const responseCategories = {
        accepted: [],
        rejected: [],
      };

      for (const category of ref._ckyStore._categories) {
        ref._ckySetInStore(`${category.slug}`, "yes");

        responseCategories.accepted.push(category.slug);
      }

      _ckyUnblock();

      _ckyClearListeners();

      _ckyFireEvent("cookieyes_consent_update", responseCategories);

      _ckySetUETInitialData();
    }

    function _ckyReSetConsentID() {
      if (!ref._ckyStore._resetConsentID) return;

      const cookieyesID = ref._ckyGetFromStore("consentid");

      ref._ckySetInStore("consentid", cookieyesID);
    }

    function _ckySetBannerAction(action) {
      ref._ckySetInStore("action", action);
    }

    function _ckyRemoveDeadCookies({ cookies }) {
      const currentCookieMap = ref._ckyGetCookieMap();

      for (const { cookieID, domain } of cookies) {
        const cookieToReset = getKeyToReset(currentCookieMap, cookieID);

        if (cookieToReset) {
          const strippedHost = window.location.host;
          const cleanedHost = strippedHost.replace("www", "");
          [domain, "", strippedHost, cleanedHost].map((cookieDomain) =>
            ref._ckySetCookie(cookieToReset, "", 0, cookieDomain)
          );
          delete currentCookieMap[cookieToReset];
          continue;
        }

        const localDataToReset = getKeyToReset(localStorage, cookieID);
        if (localDataToReset) localStorage.removeItem(localDataToReset);
        const sessionDataToReset = getKeyToReset(sessionStorage, cookieID);
        if (sessionDataToReset) sessionStorage.removeItem(sessionDataToReset);
      }
    }

    function getKeyToReset(objectData, keyToSearch) {
      try {
        keyToSearch = ref._ckyEscapeRegex(keyToSearch);
        if (keyToSearch.includes("*"))
          keyToSearch = keyToSearch.replace("\\*", ".+");
        keyToSearch = `^${keyToSearch}$`;
        const dataToReset = Object.keys(objectData).find((key) =>
          new RegExp(keyToSearch).test(key)
        );
        return dataToReset;
      } catch (error) {
        return "";
      }
    }

    function _ckySetUETInitialData() {
      window.uetq = window.uetq || [];

      _ckySetUETConsentMode();
    }

    function _ckySetUETConsentMode() {
      const advertisementConsent = _ckyGetConsentString("advertisement");

      _ckyPushUETConsentData("consent", "update", {
        ad_storage: advertisementConsent,
      });
    }

    function _ckySetClarityConsentMode() {
      if (!window.clarity) return;
      if (ref._ckyIsCategoryToBeBlocked("analytics"))
        window.clarity("consent", false);
      else window.clarity("consent");
    }

    async function _ckyFindApplyingRule() {
      try {
        if (window.ckySettings && window.ckySettings.ruleSet)
          ref.ruleSet = window.ckySettings.ruleSet;
        else {
          const response = await _ckyRequest(
            `https://mojoview.com/client_data/dca53fe1d0d8ed251125dfb3/J8eNbEgC.json`
          );
          ref.ruleSet = await response.json();
        }
        if (!Array.isArray(ref.ruleSet) || ref.ruleSet.length <= 0)
          return false;

        if (ref._ckyStore._isPreview) {
          const rule = ref.ruleSet[ref.ruleSet.length - 1];
          return ref._ckyStore._banners[rule.targetBanner];
        }

        const firstRule = ref.ruleSet[0];
        if (firstRule.condition === "all")
          return ref._ckyStore._banners[firstRule.targetBanner];
        await _ckyGeoIP();

        for (const rule of ref.ruleSet) {
          if (rule.condition === "all" || _ckyParseRule(rule.condition))
            return ref._ckyStore._banners[rule.targetBanner];
        }

        if (ref._ckyStore._ruleData._geoIPStatus === "FAIL") {
          const rule = ref.ruleSet[ref.ruleSet.length - 1];
          return ref._ckyStore._banners[rule.targetBanner];
        }
      } catch (error) {}

      return false;
    }

    function _ckyParseRule(rule) {
      const isOrRule = / OR /i.test(rule);
      const isAndRule = / AND /i.test(rule);
      if (!isOrRule && !isAndRule) return _ckyCheckRule(rule);
      const rules = rule.split(isOrRule ? / OR /i : / AND /i);

      for (const rule of rules) {
        const ruleOutput = _ckyParseRule(rule);

        if (isOrRule && ruleOutput) return true;
        else if (!isOrRule && !ruleOutput) return false;
      }

      return !isOrRule;
    }

    function _ckyCheckRule(condition) {
      const [lhs, rhs] = condition.split(/ IS | IS_NOT | IN | NOT_IN /i);

      switch (true) {
        case / IS /i.test(condition):
          if (
            lhs === "regionName" &&
            rhs === "'EU'" &&
            ref._ckyStore._ruleData._euStatus
          )
            return true;
          return _ckyParseRuleLHS(lhs) === rhs;

        case / IS_NOT /i.test(condition):
          return _ckyParseRuleLHS(lhs) !== rhs;

        case / IN /i.test(condition):
          return rhs
            .replace(/\[|\]/g, "")
            .split(",")
            .includes(_ckyParseRuleLHS(lhs));

        case / NOT_IN /i.test(condition):
          return !rhs
            .replace(/\[|\]/g, "")
            .split(",")
            .includes(_ckyParseRuleLHS(lhs));

        default:
          return false;
      }
    }

    function _ckyParseRuleLHS(lhs) {
      switch (true) {
        case !!ref._ckyStore._ruleData[`_${lhs}`]:
          return `'${ref._ckyStore._ruleData[`_${lhs}`]}'`;

        case ref._ckyStore._ruleData[`_${lhs}`] === "":
          return "";

        case !!window.ckySettings && !!window.ckySettings[lhs]:
          return `'${window.ckySettings[lhs]}'`;

        default:
          return "";
      }
    }

    window.revisitCkyConsent = () => _ckyRevisitAction();

    window.performBannerAction = (action) => {
      const acceptStatus =
        action === "accept_all"
          ? "all"
          : action === "accept_partial"
          ? "custom"
          : "reject";
      return _ckyBannerAction(acceptStatus)({
        isTrusted: true,
      });
    };

    window.getCkyConsent = function () {
      const cookieConsent = {
        activeLaw: "",
        categories: {},
        isUserActionCompleted: false,
        consentID: "",
        languageCode: "",
      };

      try {
        cookieConsent.activeLaw = ref._ckyStore._bannerConfig.activeLaw || "";

        ref._ckyStore._categories.forEach((category) => {
          cookieConsent.categories[category.slug] =
            ref._ckyGetFromStore(category.slug) === "yes";
        });

        cookieConsent.isUserActionCompleted =
          ref._ckyGetFromStore("action") === "yes";
        cookieConsent.consentID = ref._ckyGetFromStore("consentid") || "";
        cookieConsent.languageCode = ref._ckyStore._language._active || "";
      } catch (e) {}

      return cookieConsent;
    };

    function _ckyPreferenceCenterControl(show = true) {
      let fnToCall = _ckyClassAdd,
        popupFnToCall = _ckyClassRemove;
      if (!show) (fnToCall = _ckyClassRemove), (popupFnToCall = _ckyClassAdd);
      const { activeLaw, bannerType } = ref._ckyStore._bannerConfig;

      if (bannerType === "classic") {
        _ckyToggleAriaExpandStatus("=settings-button", show ? "true" : "false");

        fnToCall("=notice", "cky-consent-bar-expand");
      } else {
        popupFnToCall(".cky-overlay", "cky-hide", false);
        if (activeLaw === "gdpr") fnToCall("=detail", "cky-modal-open");
        else fnToCall("=optout-popup", "cky-modal-open");
      }

      if (ref._ckyStore._bannerConfig.iabEnabled) _ckyUpdateVendorList(show);
    }

    function _ckyBannerControl(show = true, isRevisit = false) {
      if (show && !isRevisit) ref._ckyStore._bannerDisplayState = "banner";
      const fnToCall = show ? _ckyClassRemove : _ckyClassAdd;
      fnToCall("=notice", "cky-hide");
      if (ref._ckyStore._bannerConfig.bannerType === "popup")
        fnToCall(".cky-overlay", "cky-hide", false);
    }

    function _ckyRevisitControl(show = true) {
      if (show) ref._ckyStore._bannerDisplayState = "revisit";
      if (!ref._ckyStore._bannerConfig.showToggler) return;
      const fnToCall = show ? _ckyClassRemove : _ckyClassAdd;
      fnToCall("=revisit-consent", "cky-revisit-hide", false);
    }

    function _ckyPopulateAuditTable(action = "init") {
      if (action === "redraw") _ckyClearOutsideAuditTable();
      ref._ckyStore._auditTable._headerKeys = _ckyFindHeaders();
      const { showAuditTable, activeLaw } = ref._ckyStore._bannerConfig;
      if (showAuditTable && activeLaw === "gdpr")
        _ckyPopulateInsideAuditTable();

      _ckyPopulateOutsideAuditTable();

      if (action === "init") _ckyWatchAuditTableElement();
    }

    function _ckyPopulateInsideAuditTable() {
      const auditTableCode = ref._ckyStore._commonShortCodes.find(
        (code) => code.key === "cky_audit_table"
      );

      const auditTableEmpty = ref._ckyStore._commonShortCodes.find(
        (code) => code.key === "cky_audit_table_empty"
      );

      for (const category of ref._ckyStore._categories) {
        const categoryTableContent = _ckyGetAuditTableContent(
          category,
          auditTableCode.content.container,
          auditTableEmpty.content.container
        );

        document
          .querySelector(
            `#ckyDetailCategory${category.slug} [data-cky-tag="audit-table"]`
          )
          .insertAdjacentHTML("beforeend", categoryTableContent);
      }
    }

    function _ckyGetAuditTableContent(
      category,
      auditTableBase,
      auditTableEmpty
    ) {
      if (category.cookies.length === 0) {
        return auditTableEmpty.replace(
          "[cky_audit_table_empty_text]",
          _ckyGetTranslation(`cky_audit_table_empty_text`)
        );
      }

      let categoryContent = ``;

      for (const cookie of category.cookies) {
        let cookieContent = ``;

        for (const header of ref._ckyStore._auditTable._headerKeys) {
          cookieContent = `${cookieContent}<li><div>${_ckyGetTranslation(
            `cky_audit_table_header_${header}`
          )}</div><div>${
            header === "id"
              ? cookie.cookieID
              : _ckyGetTranslation(`cookies.${cookie.cookieID}.${header}`)
          }</div></li>`;
        }

        categoryContent = `${categoryContent}${auditTableBase.replace(
          "[CONTENT]",
          cookieContent
        )}`;
      }

      return categoryContent;
    }

    function _ckyClearOutsideAuditTable() {
      const auditTableElements = document.querySelectorAll(
        ".cky-audit-table-element"
      );
      if (auditTableElements.length < 1) return;

      for (const element of auditTableElements) element.innerHTML = "";
    }

    function _ckyPopulateOutsideAuditTable() {
      const auditTableElements = Array.from(
        document.querySelectorAll(".cky-audit-table-element")
      )
        .filter(({ innerHTML }) => ["", "&nbsp;", " "].includes(innerHTML))
        .map((element) => {
          element.innerHTML = "";
          return element;
        });
      if (auditTableElements.length < 1) return;
      if (!document.getElementById("cky-audit-table-style"))
        document.head.insertAdjacentHTML(
          "beforeend",
          `<style id="cky-audit-table-style">.cky-table-wrapper{width: 100%; max-width: 100%; overflow: auto;}.cky-cookie-audit-table{font-family: inherit; border-collapse: collapse; width: 100%;}.cky-cookie-audit-table th{background-color: #d9dfe7; border: 1px solid #cbced6;}.cky-cookie-audit-table td{border: 1px solid #d5d8df;}.cky-cookie-audit-table th,.cky-cookie-audit-table td{text-align: left; padding: 10px; font-size: 12px; color: #000000; word-break: normal;}.cky-cookie-audit-table td p{font-size: 12px; line-height: 24px; margin-bottom: 1em;}.cky-cookie-audit-table td p:last-child{margin-bottom: 0;}.cky-cookie-audit-table tr:nth-child(2n + 1) td{background: #f1f5fa;}.cky-cookie-audit-table tr:nth-child(2n) td{background: #ffffff;}.cky-audit-table-element h3{margin: 35px 0 16px 0;}.cky-audit-table-element .cky-table-wrapper{margin-bottom: 1rem;}.cky-audit-table-element .cky-category-des p{margin-top: 0;}</style>`
        );

      const auditTableOutside = ref._ckyStore._commonShortCodes.find(
        (code) => code.key === "cky_outside_audit_table"
      );

      for (const category of ref._ckyStore._categories) {
        const outTableContent = _ckyGetAuditTableContentForPage(
          category,
          auditTableOutside.content.container
        );

        if (!outTableContent) continue;

        for (const element of auditTableElements)
          element.insertAdjacentHTML("beforeend", outTableContent);
      }
    }

    function _ckyGetAuditTableContentForPage(category, auditTableBase) {
      if (category.cookies.length === 0) return "";
      const { _headerKeys: headers } = ref._ckyStore._auditTable;
      const auditTableBasePrepared = auditTableBase
        .replace(
          `[cky_preference_{{category_slug}}_title]`,
          _ckyGetTranslation(`cky_preference_${category.slug}_title`)
        )
        .replace(
          `[cky_preference_{{category_slug}}_description]`,
          _ckyGetTranslation(`cky_preference_${category.slug}_description`)
        );
      let categoryContent = `<thead><tr>`;

      for (const header of headers) {
        categoryContent = `${categoryContent}<th>${_ckyGetTranslation(
          `cky_audit_table_header_${header}`
        )}</th>`;
      }

      categoryContent = `${categoryContent}</tr></thead><tbody>`;

      for (const cookie of category.cookies) {
        let cookieContent = `<tr>`;

        for (const header of headers) {
          cookieContent = `${cookieContent}<td>${
            header === "id"
              ? cookie.cookieID
              : _ckyGetTranslation(`cookies.${cookie.cookieID}.${header}`)
          }</td>`;
        }

        categoryContent = `${categoryContent}${cookieContent}</tr>`;
      }

      categoryContent = `${categoryContent}</tbody>`;
      return auditTableBasePrepared.replace("[CONTENT]", categoryContent);
    }

    function _ckyWatchAuditTableElement() {
      const auditTableObserver = new MutationObserver(
        _ckyPopulateOutsideAuditTable
      );
      auditTableObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    function _ckyPopulateIABOptions(inputHTML) {
      _ckyPopulatePNFTabs();

      _ckyPopulateThirdPartyLists();

      _ckyInitToggleEnabledVendorIds();

      const { iabDataShortCodes } = ref._ckyStore._bannerConfig;

      const shortCodeFinder = _ckyFindItemFromShortCode(iabDataShortCodes);

      const [replaceKey, getFinalText] = _ckyReplaceKeysInText(inputHTML);

      const purposeSectionHTML = _ckyBuildPurposeAndFeaturesUI(shortCodeFinder);

      replaceKey("cky_iab_purpose_n_features_section", purposeSectionHTML);

      const vendorsSectionHTML = _ckyBuildVendorsUI(shortCodeFinder);

      replaceKey("cky_iab_vendors_section", vendorsSectionHTML);
      return getFinalText();
    }

    function _ckyReplaceVendorCount(inputHTML) {
      return ref._ckyReplaceAll(
        inputHTML,
        "{{count}}",
        ref._thirdPartyLists[0].sublist.length +
          ref._thirdPartyLists[1].sublist.length
      );
    }

    function _ckyBuildPurposeAndFeaturesUI(shortCodeFinder) {
      const [
        purposeFeatureSection,
        purposeFeatureSectionToggle,
        purposeFeatureSectionItem,
        commonLegitimateToggle,
        commonConsentToggle,
        purposeFeatureSectionIllustration,
        purposeFeatureSectionVendorCount,
      ] = [
        "cky_iab_purpose_n_features_section",
        "cky_iab_purpose_n_features_section_toggle",
        "cky_iab_purpose_n_features_item",
        "cky_iab_common_item_legitimate_toggle",
        "cky_iab_common_item_consent_toggle",
        "cky_iab_purpose_n_features_item_illustration",
        "cky_iab_purpose_n_features_item_vendor_count",
      ].map((key) => shortCodeFinder(key));
      let sectionHTML = ``;

      ref._pnfTabs.forEach((section) => {
        let itemsHTML = ``;

        const [replaceParent, getFinalParent] = _ckyReplaceKeysInText(
          purposeFeatureSection
        );

        section.sublist.forEach((itemForSection) => {
          const [replaceKey, getFinalText] = _ckyReplaceKeysInText(
            purposeFeatureSectionItem
          );

          replaceKey(
            "cky_iab_common_item_consent_toggle",
            itemForSection.hasConsentToggle ? commonConsentToggle : ""
          );
          replaceKey(
            "cky_iab_common_item_legitimate_toggle",
            itemForSection.hasLegitimateToggle ? commonLegitimateToggle : ""
          );
          if (
            itemForSection.hasLegitimateToggle &&
            itemForSection.hasConsentToggle
          )
            replaceKey(
              "cky-legitimate-switch-wrapper",
              "cky-legitimate-switch-wrapper cky-switch-separator",
              2
            );
          let illustrationsText = "";

          if (itemForSection.illustrations.length > 0) {
            const illustrationsContent = itemForSection.illustrations.map(
              (illustration) => `<li>${illustration}</li>`
            );
            illustrationsText = purposeFeatureSectionIllustration.replace(
              "[CONTENT]",
              illustrationsContent.join("")
            );
          }

          replaceKey(
            "cky_iab_purpose_n_features_item_illustration",
            illustrationsText
          );
          const countDataText = purposeFeatureSectionVendorCount.replace(
            "[COUNT_DATA]",
            `${
              itemForSection.combinedSeeker
                ? "[cky_iab_purpose_n_feature_vendors_seeking_combained]"
                : "[cky_iab_purpose_n_feature_vendors_seeking_consent]"
            }: ${itemForSection.seekerCount}`
          );
          replaceKey(
            "cky_iab_purpose_n_features_item_vendor_count",
            countDataText
          );
          replaceKey(
            "ITEM_ID",
            `ckyIABPNFSection${section.id}Item${itemForSection.id}`
          );
          replaceKey("ITEM_NAME", itemForSection.name);
          replaceKey("USER_FRIENDLY_TEXT", itemForSection.userFriendlyText);
          itemsHTML = `${itemsHTML} ${getFinalText()}`;
        });
        replaceParent("cky_iab_purpose_n_features_item", itemsHTML);
        replaceParent(
          "cky_iab_purpose_n_features_section_toggle",
          section.toggle ? purposeFeatureSectionToggle : ""
        );
        replaceParent("{{sectionKey}}", section.key, 2);
        replaceParent("ITEM_ID", `ckyIABPNFSection${section.id}`);
        replaceParent("COUNT_DATA", `(${section.sublist.length})`);
        sectionHTML = `${sectionHTML} ${getFinalParent()}`;
      });

      return sectionHTML;
    }

    function _ckyBuildVendorsUI(shortCodeFinder) {
      const [
        vendorsSection,
        vendorsSectionToggle,
        vendorItem,
        commonLegitimateToggle,
        commonConsentToggle,
        vendorItemLegitimateLink,
        vendorItemDataRetention,
        vendorItemDataRetentionMessage,
        vendorItemPurposes,
        vendorItemTableButton,
        vendorItemSpecialPurposes,
        vendorItemFeatures,
        vendorItemSpecialFeatures,
        vendorItemDataCategories,
        vendorItemDeviceOverview,
      ] = [
        "cky_iab_vendors_section",
        "cky_iab_vendors_section_toggle",
        "cky_iab_vendors_item",
        "cky_iab_common_item_legitimate_toggle",
        "cky_iab_common_item_consent_toggle",
        "cky_iab_vendors_item_legitimate_interest",
        "cky_iab_vendors_item_data_retention",
        "cky_iab_vendors_item_data_retention_message",
        "cky_iab_vendors_item_purposes",
        "cky_iab_vendors_item_table_button",
        "cky_iab_vendors_item_special_purposes",
        "cky_iab_vendors_item_features",
        "cky_iab_vendors_item_special_features",
        "cky_iab_vendors_item_data_categories",
        "cky_iab_vendors_item_device_overview",
      ].map((key) => shortCodeFinder(key));
      let sectionHTML = ``;
      ref.vendorItemsHTML = {
        gvlVendorsHTML: [],
        googleVendorsHTML: [],
      };

      ref._thirdPartyLists.forEach((section, index) => {
        const htmlKey = index === 0 ? "gvlVendorsHTML" : "googleVendorsHTML";

        const [replaceParent, getFinalParent] =
          _ckyReplaceKeysInText(vendorsSection);

        section.sublist.forEach((itemForSection) => {
          const [replaceKey, getFinalText] = _ckyReplaceKeysInText(vendorItem);

          replaceKey(
            "cky_iab_common_item_consent_toggle",
            itemForSection.hasConsentToggle ? commonConsentToggle : ""
          );
          replaceKey(
            "cky_iab_common_item_legitimate_toggle",
            itemForSection.hasLegitimateToggle ? commonLegitimateToggle : ""
          );
          if (
            itemForSection.hasLegitimateToggle &&
            itemForSection.hasConsentToggle
          )
            replaceKey(
              "cky-legitimate-switch-wrapper",
              "cky-legitimate-switch-wrapper cky-switch-separator",
              2
            );
          replaceKey("PRIVACY_LINK", itemForSection.privacyLink);
          let legitimateInterestLink = "";

          if (itemForSection.legitimateInterestLink) {
            legitimateInterestLink = ref._ckyReplaceAll(
              vendorItemLegitimateLink,
              "[LEGITIMATE_INTEREST_LINK]",
              itemForSection.legitimateInterestLink
            );
          }

          replaceKey(
            "cky_iab_vendors_item_legitimate_interest",
            legitimateInterestLink
          );
          let retentionPeriodText = "";

          if (itemForSection.totalRetentionPeriod) {
            const dataRetentionMessage = vendorItemDataRetentionMessage.replace(
              "[DATA_RENTENTION_DAYS]",
              itemForSection.totalRetentionPeriod
            );
            retentionPeriodText = vendorItemDataRetention.replace(
              "[cky_iab_vendors_item_data_retention_message]",
              dataRetentionMessage
            );
          }

          replaceKey(
            "cky_iab_vendors_item_data_retention",
            retentionPeriodText
          );

          const purposesForConsentText = _ckyCreateVendorConsentText(
            itemForSection.purposesForConsent,
            "cky_iab_common_consent",
            vendorItemDataRetentionMessage,
            vendorItemPurposes
          );

          const purposesForLegitimateText = _ckyCreateVendorConsentText(
            itemForSection.purposesForLegitimateInterest,
            "cky_iab_common_legitimate_interest",
            vendorItemDataRetentionMessage,
            vendorItemPurposes
          );

          replaceKey(
            "cky_iab_vendors_item_purposes",
            `${purposesForConsentText} ${purposesForLegitimateText}`
          );

          const specialPurposesText = _ckyCreateVendorOptionalText(
            itemForSection.specialPurposes,
            vendorItemSpecialPurposes
          );

          replaceKey(
            "cky_iab_vendors_item_special_purposes",
            specialPurposesText
          );

          const featuresText = _ckyCreateVendorOptionalText(
            itemForSection.features,
            vendorItemFeatures
          );

          replaceKey("cky_iab_vendors_item_features", featuresText);

          const specialFeaturesText = _ckyCreateVendorOptionalText(
            itemForSection.specialFeatures,
            vendorItemSpecialFeatures
          );

          replaceKey(
            "cky_iab_vendors_item_special_features",
            specialFeaturesText
          );

          const dataCategoriesText = _ckyCreateVendorOptionalText(
            itemForSection.dataCategories,
            vendorItemDataCategories
          );

          replaceKey(
            "cky_iab_vendors_item_data_categories",
            dataCategoriesText
          );
          let deviceStorageOverviewText = "";

          if (!itemForSection.isGoogleVendor) {
            const [replaceSub, getFinalSub] = _ckyReplaceKeysInText(
              vendorItemDeviceOverview
            );

            replaceSub(
              "COOKIE_STORAGE_METHOD",
              itemForSection.cookieStorageMethod === "cookie"
                ? "[cky_iab_vendors_tracking_method_cookie_message]"
                : "[cky_iab_vendors_tracking_method_others_message]"
            );
            replaceSub(
              "COOKIE_DAY_COUNT",
              itemForSection.maximumCookieDuration
            );
            replaceSub(
              "COOKIE_REFRESH_STATUS",
              itemForSection.isCookieRefreshed
                ? "[cky_iab_vendors_cookie_refreshed_message]"
                : "[cky_iab_vendors_cookie_not_refreshed_message]"
            );
            deviceStorageOverviewText = getFinalSub();
          }

          replaceKey(
            "cky_iab_vendors_item_device_overview",
            deviceStorageOverviewText
          );
          let showMoreButtonText = "";

          if (!itemForSection.isGoogleVendor) {
            showMoreButtonText = vendorItemTableButton.replace(
              "[BUTTON_TEXT]",
              "[cky_showmore_text]"
            );
          }

          replaceKey("cky_iab_vendors_item_table_button", showMoreButtonText);
          replaceKey(
            "ITEM_ID",
            `ckyIABVendorSection${section.id}Item${itemForSection.id}`
          );
          replaceKey("ITEM_NAME", itemForSection.name);
          ref.vendorItemsHTML[htmlKey].push(getFinalText());
        });
        replaceParent("cky_iab_vendors_item", "");
        replaceParent(
          "cky_iab_vendors_section_toggle",
          section.toggle ? vendorsSectionToggle : ""
        );
        replaceParent("{{sectionKey}}", section.key, 2);
        replaceParent("ITEM_ID", `ckyIABVendorSection${section.id}`);
        replaceParent("COUNT_DATA", `(${section.sublist.length})`);
        sectionHTML = `${sectionHTML} ${getFinalParent()}`;
      });

      return sectionHTML;
    }

    function _ckyUpdateVendorList(showVendors = true) {
      if (showVendors) _ckyInsertVendorItemsHTML();
      else _ckyRemoveVendorItemsHTML();
    }

    async function _ckyInsertVendorItemsHTML() {
      const chunkSize = 50;
      const { gvlVendorsHTML } = ref.vendorItemsHTML;
      const gvlVendorsElement = document
        .getElementById("ckyIABVendorSection1")
        .querySelector(".cky-accordion-body");

      for (let i = 0; i < gvlVendorsHTML.length; i += chunkSize) {
        const chunk = gvlVendorsHTML.slice(i, i + chunkSize);

        const chunkHTML = _ckyPrepareHTML(chunk.join(""));

        gvlVendorsElement.insertAdjacentHTML("beforeend", chunkHTML);
        await yieldToMain();
      }

      const { googleVendorsHTML } = ref.vendorItemsHTML;
      const googleVendorsElement = document
        .getElementById("ckyIABVendorSection2")
        .querySelector(".cky-accordion-body");

      for (let i = 0; i < googleVendorsHTML.length; i += chunkSize) {
        const chunk = googleVendorsHTML.slice(i, i + chunkSize);

        const chunkHTML = _ckyPrepareHTML(chunk.join(""));

        googleVendorsElement.insertAdjacentHTML("beforeend", chunkHTML);
        await yieldToMain();
      }

      _ckyPopulateVendorSetSelections();

      _ckySetIABSectionSpecificItems(
        ref._thirdPartyLists,
        "ckyIABVendorSection",
        [1, 2],
        ".cky-accordion-iab-item"
      );

      _ckySetIABVendorShowMore();

      ref._ckyStore._vendorDisplayStatus = true;
    }

    async function _ckyRemoveVendorItemsHTML() {
      await yieldToMain();

      if (ref._ckyStore._vendorDisplayStatus) {
        _ckyUpdateToggleEnabledVendorIds();
      }

      const gvlVendorsElement = document
        .getElementById("ckyIABVendorSection1")
        .querySelector(".cky-accordion-body");
      gvlVendorsElement.innerHTML = "";
      const googleVendorsElement = document
        .getElementById("ckyIABVendorSection2")
        .querySelector(".cky-accordion-body");
      googleVendorsElement.innerHTML = "";
      ref._ckyStore._vendorDisplayStatus = false;
    }

    function _ckySetIABTabSelection() {
      _ckyPopulatePNFSetSelections();

      _ckySetIABTabSelectListeners();

      _ckysetIABNoticeButton();

      _ckySetIABPreferenceButton();

      _ckySIABGACMPreferenceButton();

      _ckySetIABSectionSpecificItems(
        ref._pnfTabs,
        "ckyIABPNFSection",
        [1, 4],
        ".cky-accordion-iab-item"
      );

      _ckySetIABOpenCloseMainListeners(
        ref._pnfTabs,
        "ckyIABPNFSection",
        ".cky-accordion-iab-item"
      );

      _ckySetIABOpenCloseMainListeners(
        ref._thirdPartyLists,
        "ckyIABVendorSection",
        ".cky-accordion-iab-item"
      );
    }

    function _ckyGetPNFUIChoices() {
      const [purposeList, purposeLegitimateInterestList] =
        _ckyIABGetChoicesForSection(
          "ckyIABPNFSection",
          ref._pnfTabs[0].sublist,
          1
        );

      const [specialFeaturesList] = _ckyIABGetChoicesForSection(
        "ckyIABPNFSection",
        ref._pnfTabs[3].sublist,
        4
      );

      return [purposeList, purposeLegitimateInterestList, specialFeaturesList];
    }

    function _ckyGetVendorUIChoices() {
      const [vendorConsentList, vendorLegtimateInterestList] =
        _ckyIABGetChoicesForSection(
          "ckyIABVendorSection",
          ref._thirdPartyLists[0].sublist,
          1
        );

      const iabVendorSectionToggleElement = _ckyFindElement(
        `#ckyIABVendorSection1Toggle`
      );

      const iabVendorSectionEnabled = iabVendorSectionToggleElement.checked;

      const [adtechVendorConsentList] = _ckyIABGetChoicesForSection(
        "ckyIABVendorSection",
        ref._thirdPartyLists[1].sublist,
        2
      );

      const adtechVendorSectionToggleElement = _ckyFindElement(
        `#ckyIABVendorSection2Toggle`
      );

      const adtechVendorSectionEnabled =
        adtechVendorSectionToggleElement.checked;
      return [
        vendorLegtimateInterestList,
        vendorConsentList,
        adtechVendorConsentList,
        iabVendorSectionEnabled,
        adtechVendorSectionEnabled,
      ];
    }

    function _ckyIABGetChoicesForSection(key, list, sectionID) {
      const legitimateItems = [];
      const consentedItems = [];
      list.forEach((item) => {
        const consentToggleElement = _ckyFindElement(
          `#${key}${sectionID}Item${item.id}ToggleConsent`
        );

        if (consentToggleElement && consentToggleElement.checked)
          consentedItems.push(item.id);

        const legitimateToggleElement = _ckyFindElement(
          `#${key}${sectionID}Item${item.id}ToggleLegitimate`
        );

        if (legitimateToggleElement && legitimateToggleElement.checked)
          legitimateItems.push(item.id);
      });
      return [consentedItems, legitimateItems];
    }

    async function _ckyPopulatePNFSetSelections() {
      await yieldToMain();

      const purposeData = _ckyGetIABPurposeForUI();

      const featureData = _ckyGetIABFeaturesForUI();

      _ckySetToggleForList(`ckyIABPNFSection1`, purposeData);

      _ckySetToggleForList(`ckyIABPNFSection4`, featureData);
    }

    async function _ckyPopulateVendorSetSelections() {
      await yieldToMain();

      _ckySetToggleElementChecked(
        `#ckyIABVendorSection1Toggle`,
        ref._ckyStore._vendorToggleState.iabVendorSectionEnabled
      );

      for (const item of ref._ckyStore._vendorToggleState.vendorConsentList)
        _ckySetToggleElementChecked(
          `#ckyIABVendorSection1Item${item}ToggleConsent`,
          true
        );

      for (const item of ref._ckyStore._vendorToggleState
        .vendorLegtimateInterestList)
        _ckySetToggleElementChecked(
          `#ckyIABVendorSection1Item${item}ToggleLegitimate`,
          true
        );

      _ckySetToggleElementChecked(
        `#ckyIABVendorSection2Toggle`,
        ref._ckyStore._vendorToggleState.adtechVendorSectionEnabled
      );

      for (const item of ref._ckyStore._vendorToggleState
        .adtechVendorConsentList)
        _ckySetToggleElementChecked(
          `#ckyIABVendorSection2Item${item}ToggleConsent`,
          true
        );
    }

    async function _ckySetToggleForList(
      key,
      { consent, legitimateInterest, sectionChecked }
    ) {
      await yieldToMain();

      _ckySetToggleElementChecked(`#${key}Toggle`, sectionChecked);

      _ckySetToggleForListItem(consent, key, "ToggleConsent");

      _ckySetToggleForListItem(legitimateInterest, key, "ToggleLegitimate");
    }

    function _ckySetToggleForListItem(listGroup, key, suffix) {
      if (!listGroup) return;

      for (const item of listGroup.allowed)
        _ckySetToggleElementChecked(`#${key}Item${item}${suffix}`);

      for (const item of listGroup.rejected)
        _ckySetToggleElementChecked(`#${key}Item${item}${suffix}`, false);
    }

    function _ckySetIABTabSelectListeners() {
      const tabNames = ["Cookie", "Purpose", "Vendor"];
      tabNames.forEach((tab) => {
        const tabSelector = `#ckyIABTab${tab}`;

        _ckyAttachListener(tabSelector, () => {
          if (_ckyHasClass(tabSelector, "cky-iab-nav-item-active", false))
            return;

          _ckyClassToggle(tabSelector, "cky-iab-nav-item-active", false);

          _ckyClassToggle(
            `#ckyIABSection${tab}`,
            "cky-hide-ad-settings",
            false
          );

          tabNames
            .filter((tabName) => tabName !== tab)
            .forEach((filteredName) => {
              _ckyClassRemove(
                `#ckyIABTab${filteredName}`,
                "cky-iab-nav-item-active",
                false
              );

              _ckyClassAdd(
                `#ckyIABSection${filteredName}`,
                "cky-hide-ad-settings",
                false
              );
            });
        });
      });
    }

    function _ckysetIABNoticeButton() {
      _ckyAttachListener("#ckyIABNoticeButton", () => {
        if (ref._ckyStore._bannerConfig.bannerType !== "classic")
          _ckyBannerControl(false);

        _ckyPreferenceCenterControl(true);

        _ckyOpenIABThirdpartyList();
      });
    }

    function _ckySetIABPreferenceButton() {
      _ckyAttachListener("#ckyIABPreferenceButton", () =>
        _ckyOpenIABThirdpartyList(1)
      );
    }

    function _ckySIABGACMPreferenceButton() {
      _ckyAttachListener("#ckyIABGACMPreferenceButton", () =>
        _ckyOpenIABThirdpartyList(2)
      );
    }

    async function _ckyOpenIABThirdpartyList(key) {
      await yieldToMain();
      if (
        !["sidebar-left", "sidebar-right"].includes(
          ref._ckyStore._bannerConfig.bannerPreferenceCenterType
        )
      )
        _ckyFindElement("#ckyIABTabVendor").click();
      if (!key)
        return ref._thirdPartyLists.forEach((item) =>
          _ckyClassRemove(
            `#ckyIABVendorSection${item.id}`,
            "cky-accordion-active",
            false
          )
        );
      if (
        _ckyHasClass(
          `#ckyIABVendorSection${key}`,
          "cky-accordion-active",
          false
        )
      )
        return;

      _ckyFindElement(
        `#ckyIABVendorSection${key} > .cky-accordion-iab-item`
      ).click();
    }

    function _ckySetIABSectionSpecificItems(
      list,
      key,
      allowedItems,
      toggleClass
    ) {
      _ckySetIABSectionAllToggle(list, key, allowedItems);

      _ckySetIABSectionClearToggle(list, key, allowedItems);

      _ckySetIABOpenCloseSublistListeners(list, key, toggleClass);
    }

    function _ckySetIABSectionAllToggle(list, key, allowedItems) {
      const { togglerIABSwitch } = ref._ckyStore._bannerConfig;
      list.forEach((section) => {
        if (!allowedItems.includes(section.id)) return;
        const sectionKey = `#${key}${section.id}`;

        const currentElement = _ckyFindElement(`${sectionKey}Toggle`);

        const ariaLabel = currentElement.getAttribute("aria-label");

        _ckySetCheckBoxInfo(
          currentElement,
          ariaLabel,
          {
            checked: currentElement.checked,
            addListeners: true,
          },
          togglerIABSwitch.styles
        );

        _ckyAttachListener(`${sectionKey}Toggle`, () => {
          section.sublist.forEach((item) => {
            const itemKey = `${sectionKey}Item${item.id}`;
            ["ToggleConsent", "ToggleLegitimate"].forEach((fieldName) =>
              _ckySetToggleElementChecked(
                `${itemKey}${fieldName}`,
                currentElement.checked
              )
            );
          });
        });
      });
    }

    function _ckySetIABSectionClearToggle(list, key, allowedItems) {
      list.forEach((section) => {
        if (!allowedItems.includes(section.id)) return;
        const groupID = `${key}${section.id}`;
        const toggleArray = [
          ...document
            .getElementById(groupID)
            .querySelectorAll(
              `[id^=${groupID}Item][id$=ToggleConsent], [id^=${groupID}Item][id$=ToggleLegitimate]`
            ),
        ];

        _ckySetToggleListener(toggleArray, `#${groupID}Toggle`);
      });
    }

    function _ckySetIABVendorShowMore() {
      const { iabDataShortCodes } = ref._ckyStore._bannerConfig;

      const shortCodeFinder = _ckyFindItemFromShortCode(iabDataShortCodes);

      const vendorItemStorageDisclosure = shortCodeFinder(
        "cky_iab_vendors_item_storage_disclosure"
      );
      const vendorItemTableLoader = shortCodeFinder(
        "cky_iab_vendors_item_loader"
      );
      const vendorItemTableLoadError = shortCodeFinder(
        "cky_iab_vendors_item_loaderror"
      );

      const ckyAuditTable = ref._ckyStore._commonShortCodes.find(
        (code) => code.key === "cky_audit_table"
      );

      ref._thirdPartyLists.forEach((tab) => {
        tab.sublist.forEach((item) => {
          if (item.isGoogleVendor) return;
          const selector = `#ckyIABVendorSection${tab.id}Item${item.id}DisclosureControl`;

          _ckyAttachListener(
            selector,
            _ckyVendorShowMoreListener(
              item.deviceDisclosureURL,
              tab.id,
              item.id,
              vendorItemTableLoader,
              vendorItemTableLoadError,
              vendorItemStorageDisclosure,
              ckyAuditTable.content.container
            )
          );
        });
      });
    }

    function _ckyVendorShowMoreListener(
      url,
      tabID,
      itemID,
      vendorItemTableLoader,
      vendorItemTableLoadError,
      vendorItemStorageDisclosure,
      vendorItemStorageTableContent
    ) {
      const key = `ckyIABVendorSection${tabID}Item${itemID}`;
      return async ({ target }) => {
        _ckySetContentReplacingElement(
          target,
          vendorItemTableLoader,
          key,
          "cky_iab_common_loading"
        );

        const loaderElement = _ckyFindElement(`#${key}Loader`);

        try {
          const response = await _ckyRequest(url);
          const parsedResponse = await response.json();
          if (
            !parsedResponse ||
            !parsedResponse.disclosures ||
            !parsedResponse.disclosures.length
          )
            throw new Error(`Invalid disclosures`);
          const disclosedItems = parsedResponse.disclosures.map(
            (disclosure) => ({
              name: disclosure.identifier,
              type: disclosure.type,
              duration: disclosure.maxAgeSeconds
                ? Math.round(disclosure.maxAgeSeconds / (60 * 60 * 24))
                : 0,
              domain: disclosure.domains || [],
              purpose: (disclosure.purposes || []).map(
                (id) => ref._tcModal.gvl.purposes[id].name
              ),
            })
          );

          const [replaceKey, getFinalText] = _ckyReplaceKeysInText(
            vendorItemStorageDisclosure
          );

          const contentToInsert = disclosedItems.map((disclosure) => {
            const tableItemContent = [
              "name",
              "type",
              "duration",
              "domain",
              "purpose",
            ]
              .map(
                (header) =>
                  `<li><div>${_ckyGetTranslation(
                    header === "purpose"
                      ? `cky_iab_common_purposes`
                      : `cky_iab_vendors_device_storage_disclosure_table_${header}`
                  )}</div><div>${
                    header === "purpose"
                      ? `<ul class="cky-purposes-list">${disclosure.purpose
                          .map((purpose) => `<li>${purpose}</li>`)
                          .join("")}</ul>`
                      : header === "domain"
                      ? disclosure.domain.join(",")
                      : disclosure[header]
                  }</div></li>`
              )
              .join("");
            return vendorItemStorageTableContent.replace(
              "[CONTENT]",
              tableItemContent
            );
          });
          replaceKey("CONTENT", contentToInsert.join(""));
          replaceKey(
            "cky_iab_vendors_device_storage_disclosure_title",
            null,
            2
          );

          _ckySetContentReplacingElement(loaderElement, getFinalText(), key);
        } catch (error) {
          _ckySetContentReplacingElement(
            loaderElement,
            vendorItemTableLoadError,
            key,
            "cky_iab_common_load_error"
          );
        }
      };
    }

    function _ckySetContentReplacingElement(
      element,
      template,
      key,
      message = null
    ) {
      let content = template.replace("[ITEM_ID]", key);
      if (message)
        content = content.replace(`[${message}]`, _ckyGetTranslation(message));
      element.insertAdjacentHTML("afterEnd", content);
      element.remove();
    }

    function _ckySetIABOpenCloseMainListeners(list, keyPreffix, keySuffix) {
      list.forEach((item) => {
        const itemSelector = `#${keyPreffix}${item.id} > ${keySuffix}`;

        _ckyAttachListener(itemSelector, ({ target: { id } }) => {
          const accordionButtonSelector = `#${keyPreffix}${item.id} .cky-accordion-btn`;
          if (
            ref._ckyStartsWith(id, `${keyPreffix}${item.id}Toggle`) ||
            !_ckyClassToggle(itemSelector, "cky-accordion-active")
          )
            return _ckyToggleAriaExpandStatus(accordionButtonSelector, "false");

          _ckyToggleAriaExpandStatus(accordionButtonSelector, "true");

          _ckyCleanNodesWithClasses(list, keyPreffix, item.id);
        });
      });
    }

    function _ckySetIABOpenCloseSublistListeners(list, keyPreffix, keySuffix) {
      list.forEach((item) => {
        if (item.sublist) {
          const keyPreffixSub = `${keyPreffix}${item.id}Item`;

          _ckyAttachListener(
            `#${keyPreffix}${item.id} > .cky-accordion-body`,
            ({ target }) => {
              const sectionOfAction = item.sublist.find((item) => {
                const parentElement = document.querySelector(
                  `#${keyPreffixSub}${item.id} > .cky-child-accordion-item`
                );
                return parentElement.contains(target);
              });
              if (!sectionOfAction) return;
              const itemID = `${keyPreffixSub}${sectionOfAction.id}`;
              const accordionButtonSelectorSub = `#${itemID} .cky-child-accordion-btn`;
              if (
                ref._ckyStartsWith(target.id, `${itemID}Toggle`) ||
                !_ckyClassToggle(
                  `#${itemID} > .cky-child-accordion-item`,
                  "cky-accordion-active"
                )
              )
                return _ckyToggleAriaExpandStatus(
                  accordionButtonSelectorSub,
                  "false"
                );

              _ckyToggleAriaExpandStatus(accordionButtonSelectorSub, "true");

              _ckyCleanNodesWithClasses(
                item.sublist,
                keyPreffixSub,
                sectionOfAction.id,
                ".cky-child-accordion-btn"
              );
            }
          );
        }
      });
    }

    function _ckyCreateVendorConsentText(
      items,
      subtitle,
      vendorItemDataRetentionMessage,
      vendorItemPurposes
    ) {
      let purposesForConsentText = "";

      if (items.length > 0) {
        const purposesList = items
          .map(
            (purpose) =>
              `<li>${purpose.name} ${
                purpose.dataRetention > 0
                  ? `(${vendorItemDataRetentionMessage.replace(
                      "[DATA_RENTENTION_DAYS]",
                      purpose.dataRetention
                    )})`
                  : ""
              }</li>`
          )
          .join("");
        purposesForConsentText = vendorItemPurposes
          .replace("[HEADER]", `[cky_iab_common_purposes] ([${subtitle}])`)
          .replace("[CONTENT]", purposesList);
      }

      return purposesForConsentText;
    }

    function _ckyCreateVendorOptionalText(items, optionalMessage) {
      let optionalItemText = "";

      if (items.length > 0) {
        const optionalItemList = items
          .map((item) => `<li>${item.name}</li>`)
          .join("");
        optionalItemText = optionalMessage.replace(
          "[CONTENT]",
          optionalItemList
        );
      }

      return optionalItemText;
    }

    function _ckySetToggleListener(toggleArray, parentToggle) {
      toggleArray.forEach((toggleElement) => {
        const ariaLabel = toggleElement.getAttribute("aria-label");
        const { togglerIABSwitch } = ref._ckyStore._bannerConfig;

        _ckySetCheckBoxInfo(
          toggleElement,
          ariaLabel,
          {
            checked: toggleElement.checked,
            addListeners: true,
          },
          togglerIABSwitch.styles
        );

        _ckyAttachListenerToElement(toggleElement, (event) => {
          _ckySetToggleElementChecked(parentToggle, false);
        });
      });
    }

    function _ckySetToggleElementChecked(key, value = true) {
      const element = _ckyFindElement(key);

      if (element) {
        element.checked = value;
        element.dispatchEvent(new Event("change"));
      }
    }

    function _ckyGetFocusableElements(element) {
      const wrapperElement = document.querySelector(
        `[data-cky-tag="${element}"]`
      );
      if (!wrapperElement) return [];
      const focussableElements = Array.from(
        wrapperElement.querySelectorAll(
          'a:not([disabled]), button:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])'
        )
      ).filter((element) => element.style.display !== "none");
      if (focussableElements.length <= 0) return [];
      return [
        focussableElements[0],
        focussableElements[focussableElements.length - 1],
      ];
    }

    function _ckyLoopFocus() {
      const { activeLaw, bannerType } = ref._ckyStore._bannerConfig;
      if (bannerType === "classic") return;

      if (bannerType === "popup") {
        const [firstElementBanner, lastElementBanner] =
          _ckyGetFocusableElements("notice");

        _ckyAttachFocusLoop(firstElementBanner, lastElementBanner, true);

        _ckyAttachFocusLoop(lastElementBanner, firstElementBanner);
      }

      const [firstElementPopup, lastElementPopup] = _ckyGetFocusableElements(
        activeLaw === "ccpa" ? "optout-popup" : "detail"
      );

      _ckyAttachFocusLoop(firstElementPopup, lastElementPopup, true);

      _ckyAttachFocusLoop(lastElementPopup, firstElementPopup);
    }

    function _ckyAttachFocusLoop(element, targetElement, isReverse = false) {
      if (!element || !targetElement) return;
      element.addEventListener("keydown", (event) => {
        if (
          event.which !== 9 ||
          (isReverse && !event.shiftKey) ||
          (!isReverse && event.shiftKey)
        )
          return;
        event.preventDefault();
        targetElement.focus();
      });
    }

    function _ckyCloseButtonAction() {
      _ckyPreferenceCenterControl(false);

      const { activeLaw, bannerType } = ref._ckyStore._bannerConfig;

      if (ref._ckyStore._bannerDisplayState !== "revisit") {
        _ckyBannerControl();

        const nextFocusElement = document.querySelector(
          `[data-cky-tag="${
            activeLaw === "gdpr" ? "settings-button" : "donotsell-button"
          }"]`
        );
        return nextFocusElement && nextFocusElement.focus();
      }

      _ckyIABStatusUpdate(!_ckyHasUserProvidedConsent());

      if (bannerType === "classic") {
        _ckyBannerControl(false);
      }

      _ckyRevisitControl();
    }

    function _ckySettingsAction() {
      if (ref._ckyStore._bannerConfig.bannerType === "classic")
        return _ckyPreferenceCenterControl(!_ckyIsPreferenceOpen());

      _ckyBannerControl(false);

      _ckyPreferenceCenterControl();

      _ckyFocusModalWithRAF();
    }

    function _ckyFocusModalWithRAF() {
      if (typeof window.requestAnimationFrame !== "function") return;

      const [firstElement] = _ckyGetFocusableElements(
        ref._ckyStore._bannerConfig.activeLaw === "ccpa"
          ? "optout-popup"
          : "detail"
      );

      if (!firstElement) return;
      let attempt = 0;

      const checkModalAndFocus = () => {
        const isOpen =
          window.getComputedStyle(firstElement).visibility === "visible";

        if (isOpen) {
          firstElement.focus();
        } else if (attempt < 100) {
          attempt++;
          requestAnimationFrame(checkModalAndFocus);
        }
      };

      requestAnimationFrame(checkModalAndFocus);
    }

    function _ckyRevisitAction() {
      _ckyIABStatusUpdate(true);

      _ckyRevisitControl(false);

      if (ref._ckyStore._bannerConfig.bannerType === "classic")
        _ckyBannerControl(true, true);

      _ckyPreferenceCenterControl();

      _ckyFocusModalWithRAF();
    }

    function _ckyBannerAction(choice = "custom") {
      return (event) => {
        _ckyAcceptCookies(choice, event.isTrusted);

        _ckyIABStatusUpdate(false);

        _ckyBannerControl(false);

        _ckyPreferenceCenterControl(false);

        _ckyRevisitControl();
      };
    }

    function _ckyBannerPassiveAction() {
      _ckySetBannerAction("yes");

      if (ref._ckyStore._bannerConfig.bannerType === "classic") {
        _ckyIABStatusUpdate(!_ckyHasUserProvidedConsent());

        if (ref._ckyStore._bannerConfig.iabEnabled) {
          _ckyUpdateVendorList(false);
        }
      } else {
        _ckyIABStatusUpdate(true);
      }

      _ckyBannerControl(false);

      _ckyRevisitControl();
    }

    function _ckyRegisterListeners() {
      ["=accept-button", "=detail-accept-button"].map((key) =>
        _ckyAttachListener(key, _ckyBannerAction("all"))
      );
      ["=reject-button", "=detail-reject-button"].map((key) =>
        _ckyAttachListener(key, _ckyBannerAction("reject"))
      );
      [
        "=detail-save-button",
        "=detail-category-preview-save-button",
        "=optout-confirm-button",
      ].map((key) => _ckyAttachListener(key, _ckyBannerAction()));
      ["=settings-button", "=donotsell-button"].map((key) =>
        _ckyAttachListener(key, _ckySettingsAction)
      );
      ["=optout-cancel-button", "=detail-close", "=optout-close"].map((key) =>
        _ckyAttachListener(key, _ckyCloseButtonAction)
      );

      _ckyAttachListener("=close-button", _ckyBannerPassiveAction);

      _ckyAttachListener("=revisit-consent", _ckyRevisitAction);
    }

    function _ckyAttachCategoryListeners() {
      if (!ref._ckyStore._bannerConfig.showAuditTable) return;

      const categoryNames = ref._ckyStore._categories.map(({ slug }) => slug);

      categoryNames.map((category) => {
        const selector = `#ckyDetailCategory${category}`;
        const accordionButtonSelector = `${selector}  .cky-accordion-btn`;

        _ckyAttachListener(selector, ({ target: { id } }) => {
          if (
            id === `ckySwitch${category}` ||
            !_ckyClassToggle(selector, "cky-accordion-active", false)
          )
            return _ckyToggleAriaExpandStatus(accordionButtonSelector, "false");

          _ckyToggleAriaExpandStatus(accordionButtonSelector, "true");

          categoryNames
            .filter((categoryName) => categoryName !== category)
            .map((filteredName) => {
              _ckyClassRemove(
                `#ckyDetailCategory${filteredName}`,
                "cky-accordion-active",
                false
              );

              _ckyToggleAriaExpandStatus(
                `#ckyDetailCategory${filteredName} .cky-accordion-btn`,
                "false"
              );
            });
        });
      });
    }

    async function _ckySetCategorySelections(addListeners = true) {
      await yieldToMain();
      const { dataShortCodes, togglerSwitch, activeLaw } =
        ref._ckyStore._bannerConfig;
      const toggleDataCode = dataShortCodes.find(
        (code) => code.key === "cky_category_toggle_label"
      );

      for (const category of ref._ckyStore._categories) {
        const cookieValue = ref._ckyGetFromStore(category.slug);

        const checked =
          cookieValue === "yes" ||
          (!cookieValue && category.defaultConsent[activeLaw]);
        const formattedLabel = toggleDataCode.content.container.replace(
          `[cky_preference_{{category_slug}}_title]`,
          _ckyGetTranslation(`cky_preference_${category.slug}_title`)
        );
        [`ckyCategoryDirect`, `ckySwitch`].map((key) =>
          _ckySetCheckBoxInfo(
            _ckyFindElement(`#${key}${category.slug}`),
            formattedLabel,
            {
              checked,
              disabled: category.isNecessary,
              addListeners,
            },
            togglerSwitch.styles
          )
        );
      }
    }

    function _ckySetCheckBoxInfo(
      boxElem,
      formattedLabel,
      { checked, disabled, addListeners },
      { activeColor, inactiveColor },
      isCCPA = false
    ) {
      if (!boxElem) return;
      if (isCCPA && addListeners)
        _ckyAttachListener("=optout-option-title", () => boxElem.click());
      boxElem.checked = checked;
      boxElem.disabled = disabled;
      boxElem.style.backgroundColor = checked ? activeColor : inactiveColor;

      _ckySetCheckBoxAriaLabel(boxElem, checked, formattedLabel, isCCPA);

      if (!addListeners) return;
      boxElem.addEventListener("change", ({ currentTarget: elem }) => {
        const isChecked = elem.checked;
        elem.style.backgroundColor = isChecked ? activeColor : inactiveColor;

        _ckySetCheckBoxAriaLabel(boxElem, isChecked, formattedLabel, isCCPA);
      });
    }

    function _ckySetCheckBoxAriaLabel(
      boxElem,
      isChecked,
      formattedLabel,
      isCCPA = false
    ) {
      const keyName = isChecked ? "disable" : "enable";
      const textCode = `cky_${keyName}_${isCCPA ? "optout" : "category"}_label`;
      const labelText = formattedLabel
        .replace(/{{status}}/g, keyName)
        .replace(`[${textCode}]`, _ckyGetTranslation(textCode));
      boxElem.setAttribute("aria-label", labelText);
    }

    function _ckyFindCheckBoxValue(id = "") {
      const elemetsToCheck = id
        ? [`ckySwitch`, `ckyCategoryDirect`]
        : [`ckyCCPAOptOut`];
      return elemetsToCheck.some((key) => {
        const checkBox = _ckyFindElement(`#${key}${id}`);

        return checkBox && checkBox.checked;
      });
    }

    function _ckyAttachReadMore() {
      const { readMore: readMoreButton, activeLaw } =
        ref._ckyStore._bannerConfig;
      if (readMoreButton.status)
        _ckyAttachLinkToLastChild(
          "cky_readmore",
          "cky_readmore_text",
          "cky_readmore_privacyLink",
          activeLaw === "gdpr" ? "iab-description" : "description"
        );
    }

    function _ckySetShowMoreLess() {
      const { dataShortCodes, activeLaw } = ref._ckyStore._bannerConfig;
      const showCode = dataShortCodes.find(
        (code) => code.key === "cky_show_desc"
      );
      const hideCode = dataShortCodes.find(
        (code) => code.key === "cky_hide_desc"
      );
      if (!showCode || !hideCode) return;
      const hideButtonContent = `${ref._ckyReplaceAll(
        hideCode.content.button,
        "[cky_showless_text]",
        _ckyGetTranslation("cky_showless_text")
      )}`;
      const showButtonContent = `${ref._ckyReplaceAll(
        showCode.content.button,
        "[cky_showmore_text]",
        _ckyGetTranslation("cky_showmore_text")
      )}`;
      const contentLimit = window.innerWidth < 376 ? 150 : 300;
      const element = document.querySelector(
        `[data-cky-tag="${
          activeLaw === "gdpr" ? "detail" : "optout"
        }-description"]`
      );
      const content = element.textContent;
      if (content.length < contentLimit) return;
      const contentHTML = element.innerHTML;
      const htmlDoc = new DOMParser().parseFromString(contentHTML, "text/html");
      const innerElements = htmlDoc.querySelectorAll("body > p");
      if (innerElements.length <= 1) return;
      let strippedContent = ``;

      for (let index = 0; index < innerElements.length; index++) {
        if (index === innerElements.length - 1) return;
        const element = innerElements[index];
        if (`${strippedContent}${element.outerHTML}`.length > contentLimit)
          element.insertAdjacentHTML(
            "beforeend",
            `...&nbsp;${showButtonContent}`
          );
        strippedContent = `${strippedContent}${element.outerHTML}`;
        if (strippedContent.length > contentLimit) break;
      }

      function showMoreHandler() {
        element.innerHTML = `${contentHTML}${hideButtonContent}`;

        _ckyAttachListener("=hide-desc-button", showLessHandler);
      }

      function showLessHandler() {
        element.innerHTML = strippedContent;

        _ckyAttachListener("=show-desc-button", showMoreHandler);
      }

      showLessHandler();
    }

    ref._ckySetPlaceHolder = function (uniqueID = "") {
      const { status, styles } = ref._ckyStore._bannerConfig.placeHolder;
      if (!status) return;
      const placeHolderQuery = `${
        uniqueID ? `#${uniqueID} ` : ""
      }[data-cky-tag="placeholder-title"]`;
      const placeHolders = document.querySelectorAll(placeHolderQuery);
      if (placeHolders.length < 1) return;
      Array.from(placeHolders).forEach((placeHolder) => {
        placeHolder.innerHTML = _ckyGetTranslation(
          "cky_video_placeholder_title"
        );
        placeHolder.style.display = "block";
        placeHolder.addEventListener("click", () => {
          if (ref._ckyStore._bannerDisplayState === "revisit")
            _ckyRevisitAction();
        });

        for (const style in styles) {
          if (!styles[style]) continue;
          placeHolder.style[style] = styles[style];
        }
      });
    };

    function _ckyIsPreferenceOpen() {
      const { activeLaw, bannerType } = ref._ckyStore._bannerConfig;
      if (bannerType === "classic")
        return _ckyHasClass("=notice", "cky-consent-bar-expand");
      if (activeLaw === "gdpr")
        return _ckyHasClass("=detail", "cky-modal-open");
      return _ckyHasClass("=optout-popup", "cky-modal-open");
    }

    function _ckyRemoveAndReInitializeBanner() {
      const isPreferenceOpen = _ckyIsPreferenceOpen();

      [
        "=notice",
        "=detail",
        "=optout-popup",
        ".cky-overlay",
        "=revisit-consent",
      ].map((key, index) => _ckyRemoveElement(key, index < 3));

      _ckyAttachBannerToUI();

      _ckyPopulateAuditTable("redraw");

      if (isPreferenceOpen) {
        if (ref._ckyStore._bannerConfig.bannerType === "classic")
          _ckyBannerControl(true, true);
        return _ckyPreferenceCenterControl();
      }

      if (ref._ckyStore._bannerDisplayState === "banner")
        return _ckyBannerControl();

      _ckyRevisitControl();
    }

    function _ckyWatchBannerElement() {
      document.querySelector("body").addEventListener("click", (event) => {
        const selector = ".cky-banner-element, .cky-banner-element *";
        if (
          event.target.matches
            ? event.target.matches(selector)
            : event.target.msMatchesSelector(selector)
        )
          _ckyRevisitAction();
      });
    }

    let userInfo = {};

    async function _ckyGeoIP() {
      try {
        const geoIPResponse = await _ckyRequest(
          "https://directory.cookieyes.com/api/v1/ip"
        );
        if (geoIPResponse.status !== 200) throw new Error(`Geo API failed`);
        const {
          ip: clientIP,
          country: countryName,
          country_name: userCountry,
          region_code: regionCode,
          in_eu: userInEU,
          continent: continent,
        } = await geoIPResponse.json();

        const maskedIp = _ckyMaskIpAddress(clientIP);

        userInfo = {
          ip: maskedIp,
          country_name: userCountry,
        };
        ref._ckyStore._ruleData._countryName = countryName ?? "";
        ref._ckyStore._ruleData._regionCode = regionCode ?? "";
        ref._ckyStore._ruleData._regionName = userInEU ? "EU_UK" : continent;
        ref._ckyStore._ruleData._euStatus = userInEU;
        ref._ckyStore._ruleData._geoIPStatus = "SUCCESS";
      } catch (err) {
        ref._ckyStore._ruleData._geoIPStatus = "FAIL";
        console.error(err);
      }
    }

    async function _ckyLogCookies(reloadOnAccept = false) {
      try {
        await yieldToMain();
        const logData = JSON.stringify(
          ref._ckyStore._categories
            .map(({ slug }) => ({
              name: slug,
              status: ref._ckyGetFromStore(slug) || "no",
            }))
            .concat([
              {
                name: "CookieYes Consent",
                status:
                  ref._ckyStore._bannerConfig.activeLaw === "ccpa"
                    ? "yes"
                    : ref._ckyGetFromStore("consent") || "no",
              },
            ])
        );
        const data = new FormData();
        data.append("log", logData);
        data.append("key", "e0cbb6f9f94af90997d1c988");
        if (!ref._ckyStore._ruleData._geoIPStatus) await _ckyGeoIP();
        data.append("ip", JSON.stringify(userInfo));
        data.append("consent_id", ref._ckyGetFromStore("consentid"));
        data.append("language", ref._ckyStore._language._active);
        data.append("consented_domain", window.location.host);
        data.append("cookie_list_version", "12");
        data.append("tcf_data", ref._ckyStore._tcStringValue);
        data.append("gacm_data", ref._addtlConsent);
        navigator.sendBeacon("https://log.cookieyes.com/api/v1/consent", data);
        if (reloadOnAccept) location.reload();
      } catch (err) {
        console.error(err);
      }
    }

    async function _ckyTranslatePage(toLanguage) {
      try {
        if (ref._ckyStore._language._active === toLanguage) return;
        await _ckyFetchLanguage(toLanguage);
        ref._ckyStore._language._active = toLanguage;
        await _ckyChangeGVLLanguage(toLanguage);

        _ckyRemoveAndReInitializeBanner();
      } catch (err) {
        console.error(err);
      }
    }

    function _ckyLanguageObserver(mutations) {
      for (const mutation of mutations) {
        if (mutation.type !== "attributes" || mutation.attributeName !== "lang")
          continue;

        let siteLanguage = _ckyFindApplicableLanguage(
          document.documentElement.lang
        );

        _ckyTranslatePage(siteLanguage);
      }
    }

    function _ckyFindApplicableLanguage(currentLang) {
      if (window.ckySettings && window.ckySettings.documentLang)
        currentLang = window.ckySettings.documentLang;
      currentLang = currentLang.replace(/_/g, "-");
      if (ref._ckyStore._language._localeMap[currentLang])
        return ref._ckyStore._language._localeMap[currentLang];
      if (ref._ckyStore._language._supportedMap[currentLang])
        return currentLang;
      currentLang = currentLang.split("-")[0];
      if (ref._ckyStore._language._supportedMap[currentLang])
        return currentLang;
      return ref._ckyStore._language._default;
    }

    async function _ckyGetLanguageJSON(url) {
      const response = await _ckyRequest(url);
      if (!response.ok) throw new Error(`Invalid response`);
      const languageFile = await response.json();
      if (
        !languageFile ||
        typeof languageFile !== "object" ||
        Object.keys(languageFile).length === 0
      )
        throw new Error(`Invalid response`);
      return languageFile;
    }

    async function _ckyFetchLanguage(language) {
      const languageDictionary = ref._ckyStore._language._store.get(language);

      if (
        languageDictionary &&
        languageDictionary.setAuditTableContent &&
        languageDictionary.setLanguageContent
      )
        return;
      let languageFile = {};
      if (
        (!languageDictionary || !languageDictionary.setLanguageContent) &&
        ref._ckyStore._bannerConfig.languageMap &&
        ref._ckyStore._bannerConfig.languageMap[language]
      )
        languageFile = await _ckyGetLanguageJSON(
          `https://mojoview.com/client_data/dca53fe1d0d8ed251125dfb3/translations/${ref._ckyStore._bannerConfig.languageMap[language]}.json`
        );
      let languageFileAuditTable = {};
      if (!languageDictionary || !languageDictionary.setAuditTableContent)
        languageFileAuditTable = await _ckyGetLanguageJSON(
          `https://mojoview.com/client_data/dca53fe1d0d8ed251125dfb3/audit-table/${ref._ckyStore._language._supportedMap[language]}.json`
        );

      ref._ckyStore._language._store.set(language, {
        ...languageFile,
        ...languageFileAuditTable,
        setLanguageContent: Object.keys(languageFile).length > 0,
        setAuditTableContent: Object.keys(languageFileAuditTable).length > 0,
      });

      return language;
    }

    async function _ckySetupTranslation() {
      try {
        const siteLanguage = _ckyFindApplicableLanguage(
          document.documentElement.lang
        );

        ref._ckyStore._language._active = siteLanguage;
        await _ckyFetchLanguage(siteLanguage);
        await _ckyChangeGVLLanguage(siteLanguage);

        const _ckyLangObserver = new MutationObserver(_ckyLanguageObserver);

        _ckyLangObserver.observe(document.querySelector("html"), {
          attributes: true,
        });
      } catch (err) {
        console.error(err);
      }
    }

    const { TCModel, TCString, GVL, Segment } = __webpack_require__(
      /*! ./iab-tcf-core */ "./iab-tcf-core/index.js"
    );

    const { CmpApi } = __webpack_require__(
      /*! @iabtechlabtcf/cmpapi */ "./node_modules/@iabtechlabtcf/cmpapi/lib/cjs/index.js"
    );

    function _ckyInitializeIABAPI() {
      ref._cmpAPI = new CmpApi(401, 1, true, {
        getTCData: (next, tcData, status) => {
          if (typeof tcData !== "boolean") {
            tcData.addtl_consent = ref._addtlConsent;
          }

          next(tcData, status);
        },
      });
    }

    async function _ckyInitializeIABData() {
      const gvl = await _ckyInitializeGVL();

      _ckyInitializeTCModal(gvl);
    }

    async function _ckyInitializeGVL() {
      GVL.baseUrl = "https://scriptstaging.cookieyes.com/common/";
      GVL.latestFilename = "iab-gvl-v3.json";
      GVL.languageFilename = "purposes-[LANG].json";
      const gvl = new GVL();
      await gvl.readyPromise;
      if (window.iabConfig && window.iabConfig.allowedVendors)
        gvl.narrowVendorsTo(window.iabConfig.allowedVendors);
      if (window.iabConfig && window.iabConfig.allowedGoogleVendors)
        gvl.narrowGoogleVendorsTo(window.iabConfig.allowedGoogleVendors);
      return gvl;
    }

    function _ckyCreateTCModal(gvl) {
      const tcModal = new TCModel(gvl);
      tcModal.purposeLegitimateInterests.set([2, 7, 8, 9, 10, 11]);
      tcModal.setAllVendorLegitimateInterests();
      return tcModal;
    }

    function _ckyInitializeTCModal(gvl) {
      let tcModal = null;
      const { _prevTCString, _prevGoogleACMString } = ref._ckyStore;

      if (_prevTCString) {
        tcModal = TCString.decode(_prevTCString);

        if (tcModal.policyVersion_ < gvl.tcfPolicyVersion) {
          tcModal = _ckyCreateTCModal(gvl);

          ref._ckySetCookie("euconsent", "", 0);

          ref._ckySetInStore("action", "");
        } else {
          tcModal.gvl = gvl;
          ref._ckyStore._tcStringValue = _prevTCString;
        }

        if (_prevGoogleACMString) ref._addtlConsent = _prevGoogleACMString;
      } else {
        tcModal = _ckyCreateTCModal(gvl);
      }

      tcModal.cmpId = 401;
      tcModal.cmpVersion = 1;
      tcModal.isServiceSpecific = true;
      ref._tcModal = tcModal;
    }

    function _ckyIABStatusUpdate(uiStatus = false) {
      const { activeLaw } = ref._ckyStore._bannerConfig;

      ref._cmpAPI.update(
        activeLaw === "gdpr" ? ref._ckyStore._tcStringValue : null,
        uiStatus
      );
    }

    async function _ckyChangeGVLLanguage(language) {
      try {
        await ref._tcModal.gvl.changeLanguage(language);
      } catch (err) {
        console.error(err);
      }
    }

    function _ckyGetTCEncodedString() {
      return TCString.encode(ref._tcModal, {
        segments: [Segment.CORE, Segment.PUBLISHER_TC],
      });
    }

    function _ckySetGoogleACMState(vendorConsents) {
      ref._addtlConsent = `1~${vendorConsents.join(".")}`;
    }

    function _ckySetIABConsentState(choice = "all") {
      if (choice === "all") {
        ref._tcModal.purposeLegitimateInterests.set([2, 7, 8, 9, 10, 11]);

        ref._tcModal.setAllPurposeConsents();

        ref._tcModal.setAllSpecialFeatureOptins();

        ref._tcModal.setAllVendorLegitimateInterests();

        ref._tcModal.setAllVendorConsents();

        _ckySetGoogleACMState(Array.from(ref._tcModal.gvl.googleVendorIds));
      } else {
        ref._tcModal.unsetAll();

        _ckySetGoogleACMState([]);

        const { activeLaw } = ref._ckyStore._bannerConfig;

        if (choice === "custom" && activeLaw === "gdpr") {
          const [
            purposeList,
            purposeLegitimateInterestList,
            specialFeaturesList,
          ] = _ckyGetPNFUIChoices();

          if (ref._ckyStore._vendorDisplayStatus) {
            _ckyUpdateToggleEnabledVendorIds();
          }

          const {
            vendorLegtimateInterestList,
            vendorConsentList,
            adtechVendorConsentList,
          } = ref._ckyStore._vendorToggleState;

          ref._tcModal.vendorConsents.set(vendorConsentList);

          ref._tcModal.vendorLegitimateInterests.set(
            vendorLegtimateInterestList
          );

          ref._tcModal.purposeLegitimateInterests.set(
            purposeLegitimateInterestList
          );

          ref._tcModal.purposeConsents.set(purposeList);

          ref._tcModal.specialFeatureOptins.set(specialFeaturesList);

          _ckySetGoogleACMState(adtechVendorConsentList);
        }
      }

      ref._ckyStore._tcStringValue = _ckyGetTCEncodedString();

      ref._ckySetCookie(
        "euconsent",
        `${ref._ckyStore._tcStringValue},${ref._ckyEncodeACString(
          ref._addtlConsent || ""
        )}`,
        ref._ckyStore._bannerConfig.scriptExpiry
      );
    }

    function _ckyGetIABVendorsForUI() {
      const response = {
        sectionChecked: false,
        consent: new Set(),
        legitimateInterest: new Set(),
      };

      ref._tcModal.vendorConsents.forEach((hasConsent, vendorId) => {
        if (hasConsent) response.consent.add(vendorId);
      });

      ref._tcModal.vendorLegitimateInterests.forEach((hasConsent, vendorId) => {
        if (hasConsent) response.legitimateInterest.add(vendorId);
      });

      const vendorsWithPurpose = [];
      const vendorsWithLegIntPurposes = [];

      for (const vendor of Object.values(ref._tcModal.gvl.vendors)) {
        if (vendor.purposes.length !== 0) vendorsWithPurpose.push(vendor.id);
        if (vendor.legIntPurposes.length !== 0)
          vendorsWithLegIntPurposes.push(vendor.id);
      }

      response.sectionChecked =
        response.consent.size >= vendorsWithPurpose.length &&
        response.legitimateInterest.size >= vendorsWithLegIntPurposes.length;
      return response;
    }

    function _ckyGetGoogleVendorsForUI() {
      const response = {
        sectionChecked: false,
        consent: new Set(),
      };
      const allowedGoogleVendors = {};
      if (ref._addtlConsent)
        ref._addtlConsent
          .split("~")[1]
          .split(".")
          .forEach((vendorId) => (allowedGoogleVendors[vendorId] = true));
      Object.keys(ref._tcModal.gvl.googleVendors).forEach((vendor) => {
        if (allowedGoogleVendors[vendor]) response.consent.add(vendor);
      });
      response.sectionChecked =
        response.consent.size ===
        _ckyGetIntMapLength(ref._tcModal.gvl.googleVendors);
      return response;
    }

    function _ckyGetIABPurposeForUI() {
      const response = {
        consent: {
          allowed: [],
          rejected: [],
        },
        legitimateInterest: {
          allowed: [],
          rejected: [],
        },
        sectionChecked: false,
      };

      ref._tcModal.purposeConsents.forEach((hasConsent, vendorId) => {
        if (hasConsent) response.consent.allowed.push(vendorId);
        else response.consent.rejected.push(vendorId);
      });

      ref._tcModal.purposeLegitimateInterests.forEach(
        (hasConsent, vendorId) => {
          if (hasConsent) response.legitimateInterest.allowed.push(vendorId);
          else response.legitimateInterest.rejected.push(vendorId);
        }
      );

      response.sectionChecked =
        response.consent.allowed.length ===
        _ckyGetIntMapLength(ref._tcModal.gvl.purposes);
      return response;
    }

    function _ckyGetIABFeaturesForUI() {
      const response = {
        consent: {
          allowed: [],
          rejected: [],
        },
        sectionChecked: false,
      };

      ref._tcModal.specialFeatureOptins.forEach((hasConsent, vendorId) => {
        if (hasConsent) response.consent.allowed.push(vendorId);
        else response.consent.rejected.push(vendorId);
      });

      response.sectionChecked =
        response.consent.allowed.length ===
        _ckyGetIntMapLength(ref._tcModal.gvl.specialFeatures);
      return response;
    }

    function _ckyPopulatePNFTabs() {
      ref._pnfTabs = [
        {
          key: "purposes",
          id: 1,
          toggle: true,
          sublist: Object.values(ref._tcModal.gvl.purposes).map(
            _ckyGetIABPurposeItem(1, true)
          ),
        },
        {
          key: "special_purposes",
          id: 2,
          toggle: false,
          sublist: Object.values(ref._tcModal.gvl.specialPurposes).map(
            _ckyGetIABPurposeItem(2, false, false)
          ),
        },
        {
          key: "features",
          id: 3,
          toggle: false,
          sublist: Object.values(ref._tcModal.gvl.features).map(
            _ckyGetIABPurposeItem(3, false, false)
          ),
        },
        {
          key: "special_features",
          id: 4,
          toggle: true,
          sublist: Object.values(ref._tcModal.gvl.specialFeatures).map(
            _ckyGetIABPurposeItem(4, true, false)
          ),
        },
      ];
    }

    function _ckyPopulateThirdPartyLists() {
      ref._thirdPartyLists = [
        {
          key: "third_party",
          id: 1,
          toggle: true,
          sublist: Object.values(ref._tcModal.gvl.vendors).map((vendor) => ({
            id: vendor.id,
            name: vendor.name,
            privacyLink: vendor.urls[0].privacy,
            legitimateInterestLink: vendor.urls[0].legIntClaim,
            hasConsentToggle: !!vendor.purposes.length,
            hasLegitimateToggle: !!vendor.legIntPurposes.length,
            totalRetentionPeriod: vendor.dataRetention.stdRetention || 0,
            dataCategories: _ckyGetIABVendorData(
              ref._tcModal.gvl.dataCategories,
              vendor.dataDeclaration || []
            ),
            purposesForConsent: _ckyGetIABVendorData(
              ref._tcModal.gvl.purposes,
              vendor.purposes,
              vendor.dataRetention
            ),
            purposesForLegitimateInterest: _ckyGetIABVendorData(
              ref._tcModal.gvl.purposes,
              vendor.legIntPurposes,
              vendor.dataRetention
            ),
            specialPurposes: _ckyGetIABVendorData(
              ref._tcModal.gvl.specialPurposes,
              vendor.specialPurposes
            ),
            features: _ckyGetIABVendorData(
              ref._tcModal.gvl.features,
              vendor.features
            ),
            specialFeatures: _ckyGetIABVendorData(
              ref._tcModal.gvl.specialFeatures,
              vendor.specialFeatures
            ),
            deviceDisclosureURL: vendor.deviceStorageDisclosureUrl,
            cookieStorageMethod:
              vendor.usesNonCookieAccess && vendor.usesCookies
                ? "others"
                : "cookie",
            maximumCookieDuration: vendor.cookieMaxAgeSeconds / (60 * 60 * 24),
            isCookieRefreshed: vendor.cookieRefresh,
            isGoogleVendor: false,
          })),
        },
      ];

      ref._thirdPartyLists.push({
        key: "google_ad",
        id: 2,
        toggle: true,
        sublist: Object.values(ref._tcModal.gvl.googleVendors).map(
          (vendor) => ({
            id: vendor.id,
            name: vendor.name,
            privacyLink: vendor.privacy,
            legitimateInterestLink: "",
            hasConsentToggle: true,
            hasLegitimateToggle: false,
            totalRetentionPeriod: 0,
            dataCategories: [],
            purposesForConsent: [],
            purposesForLegitimateInterest: [],
            specialPurposes: [],
            features: [],
            specialFeatures: [],
            deviceDisclosureURL: "",
            cookieStorageMethod: "",
            maximumCookieDuration: 0,
            isCookieRefreshed: false,
            isGoogleVendor: true,
          })
        ),
      });
    }

    function _ckyInitToggleEnabledVendorIds() {
      const vendorData = _ckyGetIABVendorsForUI();

      const googleVendorData = _ckyGetGoogleVendorsForUI();

      ref._ckyStore._vendorToggleState = {
        vendorConsentList: vendorData.consent,
        vendorLegtimateInterestList: vendorData.legitimateInterest,
        iabVendorSectionEnabled: vendorData.sectionChecked,
        adtechVendorConsentList: googleVendorData.consent,
        adtechVendorSectionEnabled: googleVendorData.sectionChecked,
      };
    }

    function _ckyUpdateToggleEnabledVendorIds() {
      const [
        vendorLegtimateInterestList,
        vendorConsentList,
        adtechVendorConsentList,
        iabVendorSectionEnabled,
        adtechVendorSectionEnabled,
      ] = _ckyGetVendorUIChoices();

      ref._ckyStore._vendorToggleState = {
        vendorConsentList,
        vendorLegtimateInterestList,
        adtechVendorConsentList,
        iabVendorSectionEnabled,
        adtechVendorSectionEnabled,
      };
      ref._ckyStore._vendorDisplayStatus = false;
    }

    function _ckyGetIABPurposeItem(
      type,
      hasConsentToggle,
      hasLegitimateInterest = null
    ) {
      return ({ id, name, description, illustrations }) => {
        let hasItemLegitimateConsent = hasLegitimateInterest;
        hasItemLegitimateConsent =
          hasItemLegitimateConsent === null
            ? ![1, 3, 4, 5, 6].includes(id)
            : hasItemLegitimateConsent;
        let seekerCount = 0;
        if (type === 1)
          seekerCount =
            _ckyGetIntMapLength(
              ref._tcModal.gvl.getVendorsWithConsentPurpose(id)
            ) +
            _ckyGetIntMapLength(
              ref._tcModal.gvl.getVendorsWithLegIntPurpose(id)
            );
        else if (type === 2)
          seekerCount = _ckyGetIntMapLength(
            ref._tcModal.gvl.getVendorsWithSpecialPurpose(id)
          );
        else if (type === 3)
          seekerCount = _ckyGetIntMapLength(
            ref._tcModal.gvl.getVendorsWithFeature(id)
          );
        else
          seekerCount = _ckyGetIntMapLength(
            ref._tcModal.gvl.getVendorsWithSpecialFeature(id)
          );
        return {
          id,
          name,
          userFriendlyText: description,
          hasConsentToggle,
          hasLegitimateToggle: hasItemLegitimateConsent,
          illustrations: illustrations.filter((item) => item),
          combinedSeeker: hasItemLegitimateConsent,
          seekerCount,
        };
      };
    }

    function _ckyGetIABVendorData(list, filter, dataRetention) {
      return Object.values(list)
        .filter((purpose) => filter.includes(purpose.id))
        .map((purpose) => {
          const response = {
            name: purpose.name,
          };
          if (dataRetention)
            response[dataRetention] = dataRetention.purposes[purpose.id] || 0;
          return response;
        });
    }

    function _ckyAttachBannerToUI() {
      const { html, css, activeLaw, iabEnabled, bannerType } =
        ref._ckyStore._bannerConfig;

      let parsedHTML = _ckyPrepareHTML(
        iabEnabled ? _ckyPopulateIABOptions(html) : html
      );

      if (iabEnabled) parsedHTML = _ckyReplaceVendorCount(parsedHTML);
      document.head.insertAdjacentHTML("beforeend", css);
      document.body.insertAdjacentHTML("afterbegin", parsedHTML);

      _ckyInitializeElementsCacheMap();

      if (bannerType === "classic")
        _ckyToggleAriaExpandStatus("=settings-button", "false");

      _ckySetCategorySelections();

      _ckyAttachCategoryListeners();

      _ckySetIABTabSelection();

      _ckyRegisterListeners();

      ref._ckySetPlaceHolder();

      _ckyAttachReadMore();

      _ckySetShowMoreLess();

      _ckyLoopFocus();

      ref._ckyStore._bannerAttached = true;
    }

    async function _ckySetupBanner(bannerID) {
      const response = await _ckyRequest(
        `https://mojoview.com/client_data/dca53fe1d0d8ed251125dfb3/config/${bannerID}.json`
      );
      const data = await response.json();
      data.shouldFollowGPC = data.respectGPC && ref._ckyStore._gpcStatus;
      ref._ckyStore._bannerConfig = data;
      await _ckySetupTranslation();

      _ckyAttachBannerToUI();

      const actionState = ref._ckyGetFromStore("action");

      _ckyIABStatusUpdate(!_ckyHasUserProvidedConsent());

      if (!actionState) {
        _ckySetInitialState();

        return _ckyBannerControl();
      }

      _ckySetUETInitialData();

      if (ref._ckyStore._isPreview) {
        _ckyIABStatusUpdate();

        _ckyBannerControl();
      } else _ckyRevisitControl();
    }

    async function _ckyWindowLoadHandler(event) {
      try {
        if (event)
          document.removeEventListener(
            "DOMContentLoaded",
            _ckyWindowLoadHandler
          );

        _ckyInitializeIABAPI();

        await _ckyInitializeIABData();
        const bannerID = await _ckyFindApplyingRule();

        if (!bannerID) {
          _ckyAllowAll();

          await _ckySetupTranslation();

          _ckyIABStatusUpdate(false);
        } else {
          await _ckySetupBanner(bannerID);

          for (const category of ref._ckyStore._categories) {
            if (ref._ckyGetFromStore(category.slug) !== "yes")
              _ckyRemoveDeadCookies(category);
          }

          _ckyWatchBannerElement();
        }

        _ckyFireEvent("cookieyes_banner_load", getCkyConsent());

        _ckyPopulateAuditTable();
      } catch (err) {
        console.error(err);
      }
    }

    function yieldToMain() {
      return new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    }

    if (document.readyState !== "loading") _ckyWindowLoadHandler();
    else document.addEventListener("DOMContentLoaded", _ckyWindowLoadHandler);
  })();

  /******/
})();

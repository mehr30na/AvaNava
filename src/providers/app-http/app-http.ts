import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs/Observable";
import {SimpleGlobal} from "ng2-simple-global";
import {User} from "../../model/user";
import {GlobalUrl} from "../globalUrl";
import {Storage} from '@ionic/storage';

/*
 Generated class for the AppHttpProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class AppHttpProvider {

  private albumTracksUrl = GlobalUrl.beeptunesAlbumTracksUrl;
  private albumInfoUrl = GlobalUrl.beeptunesAlbumInfo;

  constructor(public http: Http,
              private storage: Storage,
              private global: SimpleGlobal) {

  }


  createUser(url, user: User) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, JSON.stringify(user), {headers: headers})
      .map((res: Response) => res.json());

  }


  read(url) {
    return this.http.get(url).map(this.extractData)
      .catch(this.errorHandler);
  }

  readBack(url) {
    return this.http.get(url).map(res => {
      res.json();
    })
      .catch(this.errorHandler);
  }



  readByTokenEncoded(url, data) {
    let headers = new Headers();
    headers.append('Authorization', this.global['token']);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(url, data, {headers: headers}).map(this.extractData)
      .catch(this.errorHandler);
  }


  readByToken(url) {
    let headers = new Headers();
    headers.append('Authorization', this.global['token']);
    return this.http.get(url, {headers: headers}).map(this.extractData)
      .catch(this.errorHandler);
  }

  create(url, data) {
    return this.http.post(url, data).map(this.extractData)
      .catch(this.errorHandler);
  }


  createByConfirmSms(url) {
    return this.http.get(url).map(this.extractData)
      .catch(this.errorHandler);
  }


  getBeeptunesAlbums(url, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    headers.append('X-Beeptunes-Agent-Key', 'quimh8v1bug61o4vu3v0onn1v6');
    return this.http.post(url, data, {headers: headers}).map(this.extractData);
  }


  extractData(res: Response) {
    let body = res.json();
    return body || [];
  }

  errorHandler(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

/* tslint:disable no-unused-expression */
import { browser, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import PhotoComponentsPage from './photo.page-object';
import { PhotoDeleteDialog } from './photo.page-object';
import PhotoUpdatePage from './photo-update.page-object';
import path from 'path';

const expect = chai.expect;

describe('Photo e2e test', () => {
  let navBarPage: NavBarPage;
  let photoUpdatePage: PhotoUpdatePage;
  let photoComponentsPage: PhotoComponentsPage;
  let photoDeleteDialog: PhotoDeleteDialog;
  const fileToUpload = '../../../../../main/webapp/static/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(() => {
    browser.get('/');
    navBarPage = new NavBarPage();
    navBarPage.getSignInPage();
  });

  it('should load Photos', async () => {
    navBarPage.getEntityPage('photo');
    photoComponentsPage = new PhotoComponentsPage();
    expect(await photoComponentsPage.getTitle().getText()).to.match(/Photos/);
  });

  it('should load create Photo page', async () => {
    photoComponentsPage.clickOnCreateButton();
    photoUpdatePage = new PhotoUpdatePage();
    expect(await photoUpdatePage.getPageTitle().getAttribute('id')).to.match(/galleryApp.photo.home.createOrEditLabel/);
  });

  it('should create and save Photos', async () => {
    const nbButtonsBeforeCreate = await photoComponentsPage.countDeleteButtons();

    photoUpdatePage.setTitleInput('title');
    expect(await photoUpdatePage.getTitleInput()).to.match(/title/);
    photoUpdatePage.setDescriptionInput('description');
    expect(await photoUpdatePage.getDescriptionInput()).to.match(/description/);
    photoUpdatePage.setImageInput(absolutePath);
    // photoUpdatePage.setHeightInput('5');
    // expect(await photoUpdatePage.getHeightInput()).to.eq('5');
    // photoUpdatePage.setWidthInput('5');
    // expect(await photoUpdatePage.getWidthInput()).to.eq('5');
    // photoUpdatePage.setTakenInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    // expect(await photoUpdatePage.getTakenInput()).to.contain('2001-01-01T02:30');
    // photoUpdatePage.setUploadedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    // expect(await photoUpdatePage.getUploadedInput()).to.contain('2001-01-01T02:30');
    photoUpdatePage.albumSelectLastOption();
    // photoUpdatePage.tagSelectLastOption();
    await photoUpdatePage.save();
    expect(await photoUpdatePage.getSaveButton().isPresent()).to.be.false;

    photoComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await photoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Photo', async () => {
    photoComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await photoComponentsPage.countDeleteButtons();
    await photoComponentsPage.clickOnLastDeleteButton();

    photoDeleteDialog = new PhotoDeleteDialog();
    expect(await photoDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/galleryApp.photo.delete.question/);
    await photoDeleteDialog.clickOnConfirmButton();

    photoComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await photoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(() => {
    navBarPage.autoSignOut();
  });
});

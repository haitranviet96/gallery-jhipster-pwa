/* tslint:disable no-unused-expression */
import { browser, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import AlbumComponentsPage from './album.page-object';
import { AlbumDeleteDialog } from './album.page-object';
import AlbumUpdatePage from './album-update.page-object';

const expect = chai.expect;

describe('Album e2e test', () => {
  let navBarPage: NavBarPage;
  let albumUpdatePage: AlbumUpdatePage;
  let albumComponentsPage: AlbumComponentsPage;
  let albumDeleteDialog: AlbumDeleteDialog;

  before(() => {
    browser.get('/');
    navBarPage = new NavBarPage();
    navBarPage.getSignInPage();
  });

  it('should load Albums', async () => {
    navBarPage.getEntityPage('album');
    albumComponentsPage = new AlbumComponentsPage();
    expect(await albumComponentsPage.getTitle().getText()).to.match(/Albums/);
  });

  it('should load create Album page', async () => {
    albumComponentsPage.clickOnCreateButton();
    albumUpdatePage = new AlbumUpdatePage();
    expect(await albumUpdatePage.getPageTitle().getAttribute('id')).to.match(/galleryApp.album.home.createOrEditLabel/);
  });

  it('should create and save Albums', async () => {
    const nbButtonsBeforeCreate = await albumComponentsPage.countDeleteButtons();

    albumUpdatePage.setTitleInput('title');
    expect(await albumUpdatePage.getTitleInput()).to.match(/title/);
    albumUpdatePage.setDescriptionInput('description');
    expect(await albumUpdatePage.getDescriptionInput()).to.match(/description/);
    albumUpdatePage.setCreatedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await albumUpdatePage.getCreatedInput()).to.contain('2001-01-01T02:30');
    albumUpdatePage.userSelectLastOption();
    await albumUpdatePage.save();
    expect(await albumUpdatePage.getSaveButton().isPresent()).to.be.false;

    albumComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await albumComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Album', async () => {
    albumComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await albumComponentsPage.countDeleteButtons();
    await albumComponentsPage.clickOnLastDeleteButton();

    albumDeleteDialog = new AlbumDeleteDialog();
    expect(await albumDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/galleryApp.album.delete.question/);
    await albumDeleteDialog.clickOnConfirmButton();

    albumComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await albumComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(() => {
    navBarPage.autoSignOut();
  });
});

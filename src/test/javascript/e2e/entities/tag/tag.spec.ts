/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import TagComponentsPage from './tag.page-object';
import { TagDeleteDialog } from './tag.page-object';
import TagUpdatePage from './tag-update.page-object';

const expect = chai.expect;

describe('Tag e2e test', () => {
  let navBarPage: NavBarPage;
  let tagUpdatePage: TagUpdatePage;
  let tagComponentsPage: TagComponentsPage;
  let tagDeleteDialog: TagDeleteDialog;

  before(() => {
    browser.get('/');
    navBarPage = new NavBarPage();
    navBarPage.getSignInPage();
  });

  it('should load Tags', async () => {
    navBarPage.getEntityPage('tag');
    tagComponentsPage = new TagComponentsPage();
    expect(await tagComponentsPage.getTitle().getText()).to.match(/Tags/);
  });

  it('should load create Tag page', async () => {
    tagComponentsPage.clickOnCreateButton();
    tagUpdatePage = new TagUpdatePage();
    expect(await tagUpdatePage.getPageTitle().getAttribute('id')).to.match(/galleryApp.tag.home.createOrEditLabel/);
  });

  it('should create and save Tags', async () => {
    const nbButtonsBeforeCreate = await tagComponentsPage.countDeleteButtons();

    tagUpdatePage.setNameInput('name');
    expect(await tagUpdatePage.getNameInput()).to.match(/name/);
    await tagUpdatePage.save();
    expect(await tagUpdatePage.getSaveButton().isPresent()).to.be.false;

    tagComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await tagComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Tag', async () => {
    tagComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await tagComponentsPage.countDeleteButtons();
    await tagComponentsPage.clickOnLastDeleteButton();

    tagDeleteDialog = new TagDeleteDialog();
    expect(await tagDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/galleryApp.tag.delete.question/);
    await tagDeleteDialog.clickOnConfirmButton();

    tagComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await tagComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(() => {
    navBarPage.autoSignOut();
  });
});

import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAlbum } from 'app/shared/model/album.model';
import { getEntities as getAlbums } from 'app/entities/album/album.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './photo.reducer';
import { IPhoto } from 'app/shared/model/photo.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPhotoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPhotoUpdateState {
  isNew: boolean;
  idstag: any[];
  albumId: string;
}

export class PhotoUpdate extends React.Component<IPhotoUpdateProps, IPhotoUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idstag: [],
      albumId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (!this.state.isNew) {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getAlbums();
    this.props.getTags();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    values.taken = new Date(values.taken);
    values.uploaded = new Date(values.uploaded);

    if (errors.length === 0) {
      const { photoEntity } = this.props;
      const entity = {
        ...photoEntity,
        ...values,
        tags: mapIdList(values.tags)
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/photo');
  };

  render() {
    const { photoEntity, albums, tags, loading, updating } = this.props;
    const { isNew } = this.state;

    const { description, image, imageContentType } = photoEntity;

    const metadata = (
      <div>
        <AvGroup>
          <Label id="heightLabel" for="height">
            <Translate contentKey="galleryApp.photo.height">Height</Translate>
          </Label>
          <AvField id="photo-height" type="number" className="form-control" name="height" readOnly />
        </AvGroup>
        <AvGroup>
          <Label id="widthLabel" for="width">
            <Translate contentKey="galleryApp.photo.width">Width</Translate>
          </Label>
          <AvField id="photo-width" type="number" className="form-control" name="width" readOnly />
        </AvGroup>
        <AvGroup>
          <Label id="takenLabel" for="taken">
            <Translate contentKey="galleryApp.photo.taken">Taken</Translate>
          </Label>
          <AvInput
            id="photo-taken"
            type="datetime-local"
            className="form-control"
            name="taken"
            readOnly
            value={isNew ? null : convertDateTimeFromServer(this.props.photoEntity.taken)}
          />
        </AvGroup>
        <AvGroup>
          <Label id="uploadedLabel" for="uploaded">
            <Translate contentKey="galleryApp.photo.uploaded">Uploaded</Translate>
          </Label>
          <AvInput
            id="photo-uploaded"
            type="datetime-local"
            className="form-control"
            name="uploaded"
            readOnly
            value={isNew ? null : convertDateTimeFromServer(this.props.photoEntity.uploaded)}
          />
        </AvGroup>
      </div>
    );
    const metadataRows = isNew ? '' : metadata;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="galleryApp.photo.home.createOrEditLabel">
              <Translate contentKey="galleryApp.photo.home.createOrEditLabel">Create or edit a Photo</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : photoEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="photo-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="title">
                    <Translate contentKey="galleryApp.photo.title">Title</Translate>
                  </Label>
                  <AvField
                    id="photo-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="description">
                    <Translate contentKey="galleryApp.photo.description">Description</Translate>
                  </Label>
                  <AvInput id="photo-description" type="textarea" name="description" />
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="imageLabel" for="image">
                      <Translate contentKey="galleryApp.photo.image">Image</Translate>
                    </Label>
                    <br />
                    {image ? (
                      <div>
                        <a onClick={openFile(imageContentType, image)}>
                          <img src={`data:${imageContentType};base64,${image}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {imageContentType}, {byteSize(image)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('image')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_image" type="file" onChange={this.onBlobChange(true, 'image')} accept="image/*" />
                  </AvGroup>
                  {metadataRows}
                  <AvGroup>
                    <Label for="album.title">
                      <Translate contentKey="galleryApp.photo.album">Album</Translate>
                    </Label>
                    <AvInput
                      type="hidden"
                      name="image"
                      value={image}
                      validate={{
                        required: { value: true, errorMessage: translate('entity.validation.required') }
                      }}
                    />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label id="heightLabel" for="height">
                    <Translate contentKey="galleryApp.photo.height">Height</Translate>
                  </Label>
                  <AvField id="photo-height" type="string" className="form-control" name="height" />
                </AvGroup>
                <AvGroup>
                  <Label id="widthLabel" for="width">
                    <Translate contentKey="galleryApp.photo.width">Width</Translate>
                  </Label>
                  <AvField id="photo-width" type="string" className="form-control" name="width" />
                </AvGroup>
                <AvGroup>
                  <Label id="takenLabel" for="taken">
                    <Translate contentKey="galleryApp.photo.taken">Taken</Translate>
                  </Label>
                  <AvInput
                    id="photo-taken"
                    type="datetime-local"
                    className="form-control"
                    name="taken"
                    value={isNew ? null : convertDateTimeFromServer(this.props.photoEntity.taken)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="uploadedLabel" for="uploaded">
                    <Translate contentKey="galleryApp.photo.uploaded">Uploaded</Translate>
                  </Label>
                  <AvInput
                    id="photo-uploaded"
                    type="datetime-local"
                    className="form-control"
                    name="uploaded"
                    value={isNew ? null : convertDateTimeFromServer(this.props.photoEntity.uploaded)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="album.title">
                    <Translate contentKey="galleryApp.photo.album">Album</Translate>
                  </Label>
                  <AvInput id="photo-album" type="select" className="form-control" name="album.id">
                    <option value="" key="0" />
                    {albums
                      ? albums.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.title}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="tags">
                    <Translate contentKey="galleryApp.photo.tag">Tag</Translate>
                  </Label>
                  <AvInput
                    id="photo-tag"
                    type="select"
                    multiple
                    className="form-control"
                    name="tags"
                    value={photoEntity.tags && photoEntity.tags.map(e => e.id)}
                  >
                    <option value="" key="0" />
                    {tags
                      ? tags.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/photo" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                & nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  albums: storeState.album.entities,
  tags: storeState.tag.entities,
  photoEntity: storeState.photo.entity,
  loading: storeState.photo.loading,
  updating: storeState.photo.updating
});

const mapDispatchToProps = {
  getAlbums,
  getTags,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotoUpdate);

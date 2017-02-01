<!DOCTYPE html>
<html>
<head>
<?php echo $header?>
</head>
<body<?php echo $body_style.$direction?>>
  <div class="<?php echo $container.$container_style ?>">
<?php is_error($options) ?>
<?php echo $breadcrumbs?>
<?php echo $search ?>
<?php echo $responsive_open?>
      <table id="listr-table" class="table <?php echo $options['bootstrap']['table_style']?>">
        <thead>
          <tr>
<?php echo $table_header?>
          </tr>
        </thead>
        <tbody>
<?php echo $table_body?>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="<?php echo $table_count?>">
              <small class="float-<?php echo $left?> text-muted" dir="ltr"><?php echo $summary ?></small>
              <?php echo $kudos?>
            </td>
          </tr>
        </tfoot>
      </table>
<?php echo $responsive_close?>
<?php if ($options['general']['enable_viewer']) { ?>
    <div id="viewer-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="file-name" aria-hidden="true">
      <div class="modal-dialog <?php echo $modal_size ?>">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title text-<?php echo $left?>" id="file-name">&nbsp;</h4>
            <button type="button" class="close float-xs-<?php echo $right?>" data-dismiss="modal" aria-hidden="true">&times;</button>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <?php echo $icons['load'] ?>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <small id="file-meta" class="text-muted"></small>
            <div class="float-xs-<?php echo $right?>">
              <button type="button" class="btn <?php echo $btn_default ?>" data-dismiss="modal"><?php echo _('Close')?></button>
<?php if ($options['general']['share_button']) { ?>

              <div class="btn-group">
                <a href="#" class="btn <?php echo $btn_primary ?> fullview" download><?php echo _('Download')?></a>
                <button type="button" class="btn <?php echo $btn_primary ?> dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="sr-only">Toggle Dropdown</span>
                </button>
                <div class="dropdown-menu">
<?php if ($options['keys']['dropbox'] !== null ) { ?>
                  <a class="dropdown-item save-dropbox"><?php echo $icons_dropbox._('Save to Dropbox')?></a>
                  <div class="dropdown-divider"></div>
<?php } ?>
                  <a class="dropdown-item email-link"><?php echo $icons_email ?>Email</a>
                  <a class="dropdown-item facebook-link"><?php echo $icons_facebook ?>Facebook</a>
                  <a class="dropdown-item google-link"><?php echo $icons_gplus ?>Google+</a>
                  <a class="dropdown-item twitter-link"><?php echo $icons_twitter ?>Twitter</a>
                </div>
              </div>
<?php } else { ?>
            <a href="#" class="btn <?php echo $btn_primary ?> fullview" download><?php echo _('Download')?></a>
<?php } ?>
            </div>
          </div>
        </div>
      </div>
    </div>
<?php } ?>
  </div>
<?php echo $footer?>
</body>
</html>

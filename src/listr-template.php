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
        <tfoot>
          <tr>
            <td colspan="<?php echo $table_count?>">
              <small class="pull-xs-<?php echo $left?> text-muted" dir="ltr"><?php echo $summary ?></small>
              <?php echo $kudos?>
            </td>
          </tr>
        </tfoot>
        <tbody>
<?php echo $table_body?>
        </tbody>                          
      </table>
<?php echo $responsive_close?>
<?php if ($options['general']['enable_viewer']) { ?>
    <div class="modal fade" id="viewer-modal" tabindex="-1" role="dialog" aria-labelledby="file-name" aria-hidden="true">
      <div class="modal-dialog <?php echo $modal_size ?>">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close pull-<?php echo $right?>" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title text-<?php echo $left?>" id="file-name">&nbsp;</h4>
            <small class="text-muted" id="file-meta"></small>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
<?php if (($options['general']['enable_highlight'])) { ?>
            <div class="pull-<?php echo $left?>">
              <button type="button" class="btn <?php echo $btn_highlight ?> highlight hidden-xs-up"><?php echo _('Apply syntax highlighting')?></button>
            </div>
<?php } ?>
            <div class="pull-<?php echo $right?>">
              <button type="button" class="btn <?php echo $btn_default ?>" data-dismiss="modal"><?php echo _('Close')?></button>
<?php if ($options['general']['share_button']) { ?>

              <div class="btn-group">
                <a class="btn <?php echo $btn_primary ?> fullview"><?php echo _('Open')?></a>
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
            <a class="btn <?php echo $btn_primary ?> fullview" data-button="<?php echo _('Open')?>"></a>
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

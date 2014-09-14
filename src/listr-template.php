<!DOCTYPE html>
<html>
<head>
<?php echo $header?>
</head>
<body<?php echo $direction?>>
  <div class="<?php echo $container ?>">
<?php echo $breadcrumbs?>
<?php echo $search ?>
<?php echo $responsive_open?>
      <table id="bs-table" class="table <?php echo $options['bootstrap']['table_style']?>">
        <thead>
          <tr>
<?php echo $table_header?>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td colspan="<?php echo $table_count+1?>">
              <small class="pull-<?php echo $left?> text-muted" dir="ltr"><?php echo $contained?></small>
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
      <div class="modal-dialog <?php echo $options['bootstrap']['modal_size']?>">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close pull-<?php echo $right?>" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title text-<?php echo $left?>" id="file-name">&nbsp;</h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
<?php if (($options['cdn']['highlight_js']) && ($options['cdn']['highlight_css'])) { ?>
            <div class="pull-<?php echo $left?>">
              <button type="button" class="btn btn-link highlight hidden"><?php echo _('Apply code highlighting')?></button>
            </div>
<?php } ?>     <div class="pull-<?php echo $right?>">
              <button type="button" class="btn btn-default" data-dismiss="modal"><?php echo _('Close')?></button>
<?php if ($options['general']['share_button']) { ?>
              <div class="btn-group">
                <a class="btn btn-primary fullview" data-view="<?php echo _('View')?>" data-listen="<?php echo _('Listen')?>">
                </a>
                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                  <span class="caret"></span>
                  <span class="sr-only">Toggle Dropdown</span>
                </button>
                <ul class="dropdown-menu" role="menu">
<?php if ($options['keys']['dropbox_app']) { ?>
                  <li><a class="save-dropbox">Save to Dropbox</a></li>
                  <li class="divider"></li>
<?php } ?>
                  <li><a class="email-link">Email</a></li>
                  <li><a class="facebook-link">Facebook</a></li>
                  <li><a class="google-link">Google+</a></li>
                  <li><a class="twitter-link">Twitter</a></li>
                </ul>
              </div>
            </div>
<?php } else { ?>
            <a class="btn btn-primary fullview" data-view="<?php echo _('View')?>" data-listen="<?php echo _('Listen')?>"><?php echo _('View')?></span></a>
<?php } ?>
          </div>
        </div>
      </div>
    </div>
<?php } ?>
  </div>
<?php echo $footer?>
</body>
</html>
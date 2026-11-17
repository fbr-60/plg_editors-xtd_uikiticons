<?php
namespace Joomla\Plugin\EditorsXtd\UikitIcons\Extension;

defined('_JEXEC') or die;

use Joomla\CMS\Editor\Button\Button;
use Joomla\CMS\Event\Editor\EditorButtonsSetupEvent;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Event\SubscriberInterface;

final class UikitIcons extends CMSPlugin implements SubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            'onEditorButtonsSetup' => 'onEditorButtonsSetup',
        ];
    }

        public function onEditorButtonsSetup(EditorButtonsSetupEvent $event): void
    {
        $subject  = $event->getButtonsRegistry();
        $disabled = $event->getDisabledButtons();

        if (\in_array('uikiticons', $disabled, true)) {
            return;
        }

        $doc = $this->getApplication()->getDocument();
        $wa  = $doc->getWebAssetManager();

        // Получаем белый список иконок
        $rawIcons    = (string) $this->params->get('allowed_icons', 'check, square-check, plus, arrow-right, star, info, warning, close');
        $allowedList = array_values(array_filter(array_map('trim', explode(',', $rawIcons))));

        // Передаем массив настроек в JS безопасным способом Joomla
        $doc->addScriptOptions('plg_editorsxtd_uikiticons', [
            'icons' => $allowedList,
        ]);

        $wa->registerAndUseScript(
            'plg.editorsxtd.uikiticons',
            'media/plg_editors-xtd_uikiticons/js/uikiticons-editor.js',
            [],
            ['defer' => true]
        );

        $button = new Button(
            'uikiticons',
            [
                'text'    => 'Иконка UIkit',
                'name'    => 'uikiticons',
                'icon'    => 'star',
                'onclick' => 'window.openUikitIconsModal(\'' . $event->getEditorId() . '\'); return false;',
            ]
        );

        $subject->add($button);
    }
}

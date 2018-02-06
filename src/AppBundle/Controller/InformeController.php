<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use AppBundle\Entity\Informe;
use AppBundle\Form\InformeType;

/**
 * Informe controller.
 *
 * @Route("/informe")
 */
class InformeController extends Controller
{
    /**
     * Lists all Informe entities.
     *
     * @Route("/", name="informe_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $informes = $em->getRepository('AppBundle:Informe')->findAll();
        return $this->render('informe/index.html.twig', array(
            'informes' => $informes,
        ));
    }

    /**
     * Creates a new Informe entity.
     *
     * @Route("/new", name="informe_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $informe = new Informe();
        $form = $this->createForm('AppBundle\Form\InformeType', $informe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($informe);
            $em->flush();

            return $this->redirectToRoute('informe_show', array('id' => $informe->getId()));
        }

        return $this->render('informe/new.html.twig', array(
            'informe' => $informe,
            'form' => $form->createView(),
        ));
    }


    /**
     * Creates a new Informe entity.
     *
     * @Route("/nuevo", name="informe_nuevo")
     * @Method({"GET"})
     */
    public function nuevoAction(Request $request)  //http://localhost/rastreador/web/app_dev.php/informe/nuevo?latitud=1&longitud=0&altitud=0&velocidad=0&rumbo=0
    {
        $informe = new Informe();
        $em = $this->getDoctrine()->getManager();

        $informe->setLatitud($request->query->get('latitud'));
        $informe->setLongitud($request->query->get('longitud'));
        $informe->setAltitud($request->query->get('altitud'));
        $informe->setVelocidad($request->query->get('velocidad'));
        $informe->setRumbo($request->query->get('rumbo'));

        $informe->setRastreador($em->getRepository('AppBundle:Rastreador')->find(1)); //enviarle el rastreador tambien por GET
        $now = new \DateTime('now');
        $informe->setFechaYHora($now);
        $em->persist($informe);
        $em->flush();

        $informes = $em->getRepository('AppBundle:Informe')->findAll();
        return $this->render('informe/index.html.twig', array(
            'informes' => $informes,
        ));
    }

    /**
     * Finds and displays a Informe entity.
     *
     * @Route("/{id}", name="informe_show")
     * @Method("GET")
     */
    public function showAction(Informe $informe)
    {
        $deleteForm = $this->createDeleteForm($informe);

        return $this->render('informe/show.html.twig', array(
            'informe' => $informe,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing Informe entity.
     *
     * @Route("/{id}/edit", name="informe_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Informe $informe)
    {
        $deleteForm = $this->createDeleteForm($informe);
        $editForm = $this->createForm('AppBundle\Form\InformeType', $informe);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($informe);
            $em->flush();

            return $this->redirectToRoute('informe_edit', array('id' => $informe->getId()));
        }

        return $this->render('informe/edit.html.twig', array(
            'informe' => $informe,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a Informe entity.
     *
     * @Route("/{id}", name="informe_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Informe $informe)
    {
        $form = $this->createDeleteForm($informe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($informe);
            $em->flush();
        }

        return $this->redirectToRoute('informe_index');
    }

    /**
     * Creates a form to delete a Informe entity.
     *
     * @param Informe $informe The Informe entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Informe $informe)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('informe_delete', array('id' => $informe->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}

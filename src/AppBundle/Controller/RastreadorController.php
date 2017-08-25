<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Rastreador;
use AppBundle\Form\RastreadorType;

/**
 * Rastreador controller.
 *
 * @Route("/rastreador")
 */
class RastreadorController extends Controller
{
    /**
     * Lists all Rastreador entities.
     *
     * @Route("/", name="rastreador_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $rastreadors = $em->getRepository('AppBundle:Rastreador')->findAll();

        return $this->render('rastreador/index.html.twig', array(
            'rastreadors' => $rastreadors,
        ));
    }

    /**
     * Creates a new Rastreador entity.
     *
     * @Route("/new", name="rastreador_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $rastreador = new Rastreador();
        $form = $this->createForm('AppBundle\Form\RastreadorType', $rastreador);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($rastreador);
            $em->flush();

            return $this->redirectToRoute('rastreador_show', array('id' => $rastreador->getId()));
        }

        return $this->render('rastreador/new.html.twig', array(
            'rastreador' => $rastreador,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Rastreador entity.
     *
     * @Route("/{id}", name="rastreador_show")
     * @Method("GET")
     */
    public function showAction(Rastreador $rastreador)
    {
        $deleteForm = $this->createDeleteForm($rastreador);

        return $this->render('rastreador/show.html.twig', array(
            'rastreador' => $rastreador,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing Rastreador entity.
     *
     * @Route("/{id}/edit", name="rastreador_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Rastreador $rastreador)
    {
        $deleteForm = $this->createDeleteForm($rastreador);
        $editForm = $this->createForm('AppBundle\Form\RastreadorType', $rastreador);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($rastreador);
            $em->flush();

            return $this->redirectToRoute('rastreador_edit', array('id' => $rastreador->getId()));
        }

        return $this->render('rastreador/edit.html.twig', array(
            'rastreador' => $rastreador,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a Rastreador entity.
     *
     * @Route("/{id}", name="rastreador_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Rastreador $rastreador)
    {
        $form = $this->createDeleteForm($rastreador);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($rastreador);
            $em->flush();
        }

        return $this->redirectToRoute('rastreador_index');
    }

    /**
     * Creates a form to delete a Rastreador entity.
     *
     * @param Rastreador $rastreador The Rastreador entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Rastreador $rastreador)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('rastreador_delete', array('id' => $rastreador->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}

package bit.project.server.dao;

import bit.project.server.entity.Delivery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface DeliveryDao extends JpaRepository<Delivery, Integer>{
    @Query("select new Delivery (d.id,d.code,d.customerorder,d.contactname,d.contactno) from Delivery d")
    Page<Delivery> findAllBasic(PageRequest pageRequest);

    Delivery findByCode(String code);
    Delivery findByContactno(String contactno);
    Delivery findByPermitno(String permitno);
}